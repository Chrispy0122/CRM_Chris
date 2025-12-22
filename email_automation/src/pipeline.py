from __future__ import annotations

from src.db import fetch_recipients
from src.gmail_sender import send_email
from src.templates import thank_you_template


def run():
    print("✅ PIPELINE: leyendo desde MySQL (NO CSV)")

    recipients = fetch_recipients(limit=50)  # pon None si quieres todos
    print(f"✅ Registros encontrados: {len(recipients)}")

    for r in recipients:
        subject, text, html = thank_you_template(r.name)
        send_email(r.email, subject, text, html)


if __name__ == "__main__":
    run()
