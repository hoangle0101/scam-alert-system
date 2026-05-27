import os
import json
import numpy as np
import logging
from datetime import datetime
from app.ai.preprocessor import URLPreprocessor
from app.core.config import get_settings

# Try to import onnxruntime, fallback to rule-based if not available
try:
    import onnxruntime as ort
    _onnx_available = True
except ImportError:
    _onnx_available = False

settings = get_settings()
logger = logging.getLogger(__name__)

# Global singletons
_preprocessor = URLPreprocessor()
_ort_session = None
_onnx_loaded = False

def load_onnx_model():
    """Load the ONNX model from the models directory."""
    global _ort_session, _onnx_loaded
    
    if not _onnx_available:
        logger.warning("onnxruntime not installed. AI inference disabled.")
        return

    model_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "models", "cnn_1d_best.onnx")
    model_path = model_path.replace(".onnxx", ".onnx") # Đảm bảo không bao giờ bị dư chữ x
    
    if os.path.exists(model_path):
        try:
            _ort_session = ort.InferenceSession(model_path)
            _onnx_loaded = True
            logger.info(f"✅ AI Model loaded successfully from {model_path}")
        except Exception as e:
            logger.error(f"❌ Failed to load ONNX model: {e}")
    else:
        logger.warning(f"⚠️ ONNX model not found at {model_path}. URL scanner will use rule-based analysis only.")

class URLScanResult:
    """Compatibility class for type hinting."""
    pass

async def scan_url(url: str) -> dict:
    """
    Hybrid URL analysis: Heuristics + AI Inference.
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
    
    # 1. Rule-based / Heuristic Analysis (Fast)
    url_lower = url.lower()
    
    # Check for IP address in host
    import re
    ip_pattern = r"(\d{1,3}\.){3}\d{1,3}"
    if re.search(ip_pattern, url_lower):
        signals.append({"name": "IP Host", "score": 0.8, "detail": "URL uses direct IP address instead of a domain name"})

    # Check for HTTPS
    if not url_lower.startswith("https://"):
        signals.append({"name": "No HTTPS", "score": 0.4, "detail": "Connection is not encrypted via HTTPS"})

    # Suspicious Top-Level Domains (TLDs)
    suspicious_tlds = [".xyz", ".top", ".online", ".site", ".work", ".click", ".pw", ".bid", ".gift", ".zip", ".review", ".live", ".icu", ".vip", ".cc", ".me"]
    for tld in suspicious_tlds:
        if url_lower.endswith(tld) or f"{tld}/" in url_lower:
            signals.append({"name": "Risky TLD", "score": 0.5, "detail": f"Domain uses a TLD commonly used for scams: {tld}"})

    # Vietnamese Phishing & Scam Keywords
    phishing_keywords = [
        "login", "verify", "secure", "account", "update", "banking", "service",
        "tri-an", "khuyen-mai", "nhan-thuong", "qua-tang", "luckydraw", "shopeee",
        "lazadaa", "tiki-vouch", "momo-nhanqua", "zalo-pay", "vcb-verify",
        "bidv-online", "techcom-login", "sacom-fix", "vnpost-parcel",
        "cuc-thue", "cong-an", "phat-nguoi", "dinh-danh", "vneid-fix",
        "truc-tiep", "bong-da", "vleague", "keo-nha-cai", "xoi-lac"
    ]
    for kw in phishing_keywords:
        if kw in url_lower:
            signals.append({"name": "Suspicious Keyword", "score": 0.4, "detail": f"Contains sensitive keyword: {kw}"})

    # Structural anomalies
    if url_lower.count(".") > 3:
        signals.append({"name": "Excessive Subdomains", "score": 0.3, "detail": "High number of subdomains is typical in phishing"})
    
    if "-" in url_lower and any(bank in url_lower for bank in ["vcb", "vbi", "bidv", "tcb", "mbb"]):
        signals.append({"name": "Hyphenated Brand", "score": 0.5, "detail": "Fake bank domains often use hyphens (e.g., vietcombank-verify.com)"})

    # 2. AI Model Inference
    ai_confidence = 0.0
    if _onnx_loaded and _ort_session:
        try:
            # Preprocess
            seq = _preprocessor.preprocess(url)
            # seq shape is (200, 72) one-hot encoded
            # Convert one-hot back to indices by taking argmax
            seq_indices = np.argmax(seq, axis=1).reshape(1, 200).astype(np.int32)
            
            # [DIAGNOSTIC] In ra thông tin model để kiểm tra
            input_meta = _ort_session.get_inputs()[0]
            print(f"--- [MODEL INFO] Name: {input_meta.name} | Shape: {input_meta.shape} | Type: {input_meta.type} ---")
            
            # Run inference
            input_name = input_meta.name
            outputs = _ort_session.run(None, {input_name: seq_indices})
            
            # Xử lý kết quả (đầu ra thường là xác suất 0-1)
            ai_confidence = float(outputs[0][0][0])
            print(f"--- [AI MODEL INFERENCE] URL: {url} | Confidence: {ai_confidence:.6f} ---")
            
            if ai_confidence > settings.PHISHING_THRESHOLD:
                signals.append({
                    "name": "AI Neural Detection", 
                    "score": ai_confidence, 
                    "detail": f"AI model detected phishing patterns with {ai_confidence*100:.2f}% confidence"
                })
        except Exception as e:
            logger.error(f"Inference error: {e}")

    # 3. Aggregate Verdict
    # Base risk on max signal score or AI confidence
    max_risk_score = 0.0
    if signals:
        max_risk_score = max(s["score"] for s in signals)
    
    # Combined score (weighted average of AI and heuristics)
    final_score = (ai_confidence * 0.7) + (max_risk_score * 0.3) if _onnx_loaded else max_risk_score
    
    verdict = "legitimate"
    risk_level = "SAFE"
    
    if final_score >= 0.7:
        verdict = "phishing"
        risk_level = "CRITICAL"
    elif final_score >= 0.4:
        verdict = "suspicious"
        risk_level = "HIGH"
    elif final_score >= 0.2:
        verdict = "suspicious"
        risk_level = "LOW"

    processing_time = (datetime.now() - start_time).total_seconds() * 1000

    return {
        "verdict": verdict,
        "risk_level": risk_level,
        "confidence": round(final_score, 4),
        "processing_time_ms": round(processing_time, 2),
        "model_version": "cnn-1d-v1" if _onnx_loaded else "rule-based-v1",
        "analysis_details": {
            "ai_score": round(ai_confidence, 4),
            "heuristic_score": round(max_risk_score, 4),
            "signals": signals
        }
    }
