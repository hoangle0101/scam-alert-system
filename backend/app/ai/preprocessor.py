"""
URL preprocessing pipeline — exact replica of the training notebook's logic.
Converts raw URL strings into integer sequences for the CNN model.
"""

import json
import logging
from pathlib import Path
from typing import Optional
import numpy as np
from app.core.config import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)

class URLPreprocessor:
    def __init__(self, char_index_path: str = None, max_length: int = 200, vocab_size: int = 72):
        self.char_index_path = char_index_path or settings.CHAR_INDEX_PATH
        self.max_length = max_length
        self.vocab_size = vocab_size
        self._char_index = None
        
    def load_char_index(self) -> dict:
        """Load the character-to-index mapping (singleton)."""
        if self._char_index is None:
            path = Path(self.char_index_path)
            if not path.exists():
                logger.error(f"❌ CRITICAL: char_index.json not found at {path}!")
                return {}
            with open(path, "r", encoding="utf-8") as f:
                self._char_index = json.load(f)
            logger.info(f"✅ Loaded char_index with {len(self._char_index)} characters")
        return self._char_index

    def preprocess(self, url: str) -> np.ndarray:
        """
        Convert a URL string to a padded integer sequence and then to one-hot encoding.
        Input shape: (200,) -> Output shape: (200, 72)
        """
        char_index = self.load_char_index()
        url = url.lower().strip()
        
        # 1. Ánh xạ ký tự sang số (Sử dụng 0 cho ký tự không có trong từ điển)
        sequence = []
        for char in url:
            if char in char_index:
                sequence.append(char_index[char])
            else:
                sequence.append(0) 
        
        # 2. Cắt hoặc Bù (Truncate/Pad) để đạt độ dài 200
        if len(sequence) > self.max_length:
            sequence = sequence[:self.max_length]
        else:
            sequence.extend([0] * (self.max_length - len(sequence)))
            
        # 3. Chuyển sang One-hot encoding (200, 72)
        result = np.zeros((self.max_length, self.vocab_size), dtype=np.float32)
        for i, idx in enumerate(sequence):
            if 0 <= idx < self.vocab_size:
                result[i, idx] = 1.0
                
        return result
