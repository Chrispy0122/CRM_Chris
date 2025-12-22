from __future__ import annotations
import os
from dotenv import load_dotenv

load_dotenv()

def _get_bool(name: str, default: bool = False) -> bool:
    raw = os.getenv(name, str(default)).strip().lower()
    return raw in ("1", "true", "yes", "y", "on")

DRY_RUN = _get_bool("DRY_RUN", True)

GMAIL_SENDER = os.getenv("GMAIL_SENDER", "")
GOOGLE_CREDENTIALS_PATH = os.getenv("GOOGLE_CREDENTIALS_PATH", "credentials.json")
GOOGLE_TOKEN_PATH = os.getenv("GOOGLE_TOKEN_PATH", "token.json")

if not GMAIL_SENDER:
    raise ValueError("Falta GMAIL_SENDER en el .env")
