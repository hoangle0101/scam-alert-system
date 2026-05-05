import json
import torch
import os
import time
from transformers import AutoTokenizer
from optimum.onnxruntime import ORTModelForSequenceClassification

class TextScanner:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        self._load()
        self._initialized = True

    def _load(self):
        # Đường dẫn tới thư mục model
        model_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
            "models", "distilbert-phishing"
        )
        
        # Cấu hình mặc định
        self.threshold = 0.40
        self.max_length = 256
        
        # Load metadata nếu có
        meta_path = os.path.join(model_path, "metadata.json")
        if os.path.exists(meta_path):
            try:
                with open(meta_path, encoding='utf-8') as f:
                    meta = json.load(f)
                    self.threshold = meta.get("threshold", self.threshold)
                    self.max_length = meta.get("max_length", self.max_length)
            except Exception as e:
                pass # Silently fail for metadata

        try:
            # Sử dụng đường dẫn trực tiếp, tránh in ra console nếu có ký tự đặc biệt gây lỗi encoding
            self.tokenizer = AutoTokenizer.from_pretrained(model_path)
            self.model = ORTModelForSequenceClassification.from_pretrained(model_path)
        except Exception as e:
            raise e

    def scan(self, text: str) -> dict:
        start_time = time.time()
        
        inputs = self.tokenizer(
            text, 
            return_tensors="pt",
            truncation=True, 
            max_length=self.max_length
        )
        
        with torch.no_grad():
            outputs = self.model(**inputs)
            
        probs = torch.softmax(torch.tensor(outputs.logits), dim=-1)[0]
        phishing_score = float(probs[1])
        
        verdict = "phishing" if phishing_score >= self.threshold else "legitimate"
        processing_time = (time.time() - start_time) * 1000
        
        return {
            "verdict": verdict,
            "confidence": round(phishing_score, 4),
            "risk_level": (
                "CRITICAL" if phishing_score >= 0.80 else
                "HIGH"     if phishing_score >= 0.60 else
                "MEDIUM"   if phishing_score >= self.threshold else
                "SAFE"
            ),
            "model_version": "distilbert-multilingual-v1",
            "processing_time_ms": round(processing_time, 2),
            "analysis_details": {
                "signals": [
                    {"detail": "Neural network intent analysis complete", "score": phishing_score}
                ]
            }
        }

# Async wrapper for ScanService
async def scan_message(text: str) -> dict:
    scanner = TextScanner()
    return scanner.scan(text)
