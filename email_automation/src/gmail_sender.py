from __future__ import annotations

import base64
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from google.auth.transport.requests import Request

from .config import DRY_RUN, GMAIL_SENDER, GOOGLE_CREDENTIALS_PATH, GOOGLE_TOKEN_PATH

SCOPES = ["https://www.googleapis.com/auth/gmail.send"]


def _get_gmail_service():
    creds: Optional[Credentials] = None

    try:
        creds = Credentials.from_authorized_user_file(GOOGLE_TOKEN_PATH, SCOPES)
    except Exception:
        creds = None

    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())

    if not creds or not creds.valid:
        flow = InstalledAppFlow.from_client_secrets_file(GOOGLE_CREDENTIALS_PATH, SCOPES)
        creds = flow.run_local_server(port=0)

        # ✅ BUG FIX: encoding correcto
        with open(GOOGLE_TOKEN_PATH, "w", encoding="utf-8") as f:
            f.write(creds.to_json())

    return build("gmail", "v1", credentials=creds)


def build_message(to_email: str, subject: str, body_text: str, body_html: Optional[str] = None) -> dict:
    msg = MIMEMultipart("alternative")
    msg["To"] = to_email
    msg["From"] = GMAIL_SENDER
    msg["Subject"] = subject

    msg.attach(MIMEText(body_text, "plain", "utf-8"))

    if body_html:
        msg.attach(MIMEText(body_html, "html", "utf-8"))

    raw = base64.urlsafe_b64encode(msg.as_bytes()).decode("utf-8")
    return {"raw": raw}


def send_email(to_email: str, subject: str, body_text: str, body_html: Optional[str] = None) -> None:
    if DRY_RUN:
        print("\n=== DRY_RUN (NO SE ENVÍA) ===")
        print("TO:", to_email)
        print("SUBJECT:", subject)
        print("BODY:\n", body_text[:800])
        if body_html:
            print("\nHTML PREVIEW (first 800 chars):\n", body_html[:800])
        print("=== END DRY_RUN ===\n")
        return

    service = _get_gmail_service()
    message = build_message(to_email, subject, body_text, body_html)
    service.users().messages().send(userId="me", body=message).execute()
