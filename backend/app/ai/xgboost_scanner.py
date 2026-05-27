import os
import json
import logging
import joblib
import pickle
from datetime import datetime
from app.core.config import get_settings

try:
    import xgboost as xgb
    _xgb_available = True
except ImportError:
    _xgb_available = False

try:
    from sklearn.feature_extraction.text import TfidfVectorizer
except ImportError:
    pass

settings = get_settings()
logger = logging.getLogger(__name__)

# Global singletons
_xgb_model = None
_vectorizer = None
_model_loaded = False

def load_xgboost_model():
    """Load the XGBoost model and TF-IDF vectorizer."""
    global _xgb_model, _vectorizer, _model_loaded
    
    if not _xgb_available:
        logger.warning("xgboost not installed. XGBoost inference disabled.")
        return

    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    model_path = os.path.join(base_dir, "models", "xgboost_model.json")
    vectorizer_path = os.path.join(base_dir, "models", "tfidf_vectorizer_xgb.pkl")
    
    try:
        if os.path.exists(model_path) and os.path.exists(vectorizer_path):
            # Load vectorizer using joblib (common for scikit-learn)
            try:
                _vectorizer = joblib.load(vectorizer_path)
            except Exception as e:
                logger.warning(f"Failed to load with joblib, trying pickle: {e}")
                with open(vectorizer_path, 'rb') as f:
                    _vectorizer = pickle.load(f)
            
            # Load XGBoost model
            _xgb_model = xgb.XGBClassifier()
            _xgb_model.load_model(model_path)
            
            _model_loaded = True
            logger.info(f"✅ XGBoost Model loaded successfully")
        else:
            logger.warning(f"⚠️ XGBoost model or vectorizer not found. Expected paths: {model_path}, {vectorizer_path}")
    except Exception as e:
        logger.error(f"❌ Failed to load XGBoost model: {e}")

async def scan_url_xgboost(url: str) -> dict:
    """
    URL analysis using XGBoost Model + TF-IDF Features.
    Returns: verdict, risk_level, confidence, signals
    """
    start_time = datetime.now()
    
    # Check whitelist first to prevent false positives on highly trusted domains
    from urllib.parse import urlparse
    try:
        url_lower = url.lower().strip()
        if not url_lower.startswith("http://") and not url_lower.startswith("https://"):
            url_lower = "https://" + url_lower
        
        parsed = urlparse(url_lower)
        host = parsed.netloc
        if host.startswith("www."):
            host = host[4:]
            
        trusted_domains = {
            "google.com", "gmail.com", "youtube.com", "facebook.com",
            "microsoft.com", "apple.com", "github.com", "wikipedia.org",
            "netflix.com", "amazon.com", "linkedin.com", "twitter.com",
            "instagram.com", "zoom.us", "yahoo.com", "gemini.google.com"
        }
        
        is_trusted = False
        if host in trusted_domains:
            is_trusted = True
        else:
            for d in trusted_domains:
                if host.endswith("." + d):
                    is_trusted = True
                    break
                    
        if is_trusted:
            processing_time = (datetime.now() - start_time).total_seconds() * 1000
            return {
                "verdict": "legitimate",
                "risk_level": "SAFE",
                "confidence": 0.99,
                "processing_time_ms": round(processing_time, 2),
                "model_version": "whitelist-v1",
                "analysis_details": {
                    "ai_score": 0.0,
                    "heuristic_score": 0.0,
                    "signals": [
                        {
                            "name": "Trusted Whitelist",
                            "score": 0.0,
                            "detail": f"This URL belongs to a trusted domain ({host}) and is verified safe."
                        }
                    ]
                }
            }
    except Exception as e:
        logger.error(f"Whitelist check error: {e}")

    signals = []
    
    ai_confidence = 0.0
    if _model_loaded and _xgb_model and _vectorizer:
        try:
            # Preprocess using TF-IDF
            X_test = _vectorizer.transform([url])
            
            # Run inference
            # predict_proba returns array of probabilities for each class
            # Assuming class 1 is phishing/malicious and class 0 is legitimate
            proba = _xgb_model.predict_proba(X_test)[0]
            ai_confidence = float(proba[1]) # Probability of being phishing
            
            print(f"--- [XGBOOST INFERENCE] URL: {url} | Confidence: {ai_confidence:.6f} ---")
            
            if ai_confidence > settings.PHISHING_THRESHOLD:
                signals.append({
                    "name": "XGBoost Detection", 
                    "score": ai_confidence, 
                    "detail": f"Gradient Boosting model detected phishing patterns with {ai_confidence*100:.2f}% confidence"
                })
            else:
                signals.append({
                    "name": "XGBoost Detection", 
                    "score": 1 - ai_confidence, 
                    "detail": f"Gradient Boosting model evaluated URL as legitimate with {(1-ai_confidence)*100:.2f}% confidence"
                })
                
        except Exception as e:
            logger.error(f"XGBoost Inference error: {e}")
            signals.append({"name": "Model Error", "score": 0.0, "detail": str(e)})

    # Verdict Logic
    verdict = "legitimate"
    risk_level = "SAFE"
    
    if ai_confidence >= 0.7:
        verdict = "phishing"
        risk_level = "CRITICAL"
    elif ai_confidence >= 0.4:
        verdict = "suspicious"
        risk_level = "HIGH"
    elif ai_confidence >= 0.2:
        verdict = "suspicious"
        risk_level = "LOW"

    processing_time = (datetime.now() - start_time).total_seconds() * 1000

    return {
        "verdict": verdict,
        "risk_level": risk_level,
        "confidence": round(ai_confidence, 4),
        "processing_time_ms": round(processing_time, 2),
        "model_version": "xgboost-v1" if _model_loaded else "rule-based-v1",
        "analysis_details": {
            "ai_score": round(ai_confidence, 4),
            "heuristic_score": 0.0, # Not using heuristics for this model specifically
            "signals": signals
        }
    }
