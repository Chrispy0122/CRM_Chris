from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy import text

from src.db import get_engine
from src.templates import thank_you_template
from src.gmail_sender import send_email

app = FastAPI()

# ✅ Esto hace que http://localhost:8000/ muestre tu frontend/index.html
# y que también sirva sendThankyou.js, style.css, etc.
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")

class SendThankYouRequest(BaseModel):
    id_clients: int

@app.post("/api/send-thankyou")
def send_thankyou(payload: SendThankYouRequest):
    client_id = payload.id_clients

    engine = get_engine()

    # 👇 OJO: aquí debes poner el nombre REAL de tu tabla/columna
    sql = text("""
        SELECT name, email
        FROM clients
        WHERE id = :id
        LIMIT 1
    """)

    with engine.connect() as conn:
        row = conn.execute(sql, {"id": client_id}).fetchone()

    if not row:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

    name, email = row
    if not email:
        raise HTTPException(status_code=400, detail="Cliente sin email")

    subject, body_text, body_html = thank_you_template(name or "amigo/a")
    send_email(email, subject, body_text, body_html)

    return {"ok": True, "sent_to": email}
