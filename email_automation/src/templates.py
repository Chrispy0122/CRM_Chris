from __future__ import annotations

def thank_you_template(name: str) -> tuple[str, str, str]:
    subject = f"Gracias, {name} 🙌"
    text = f"""Hola {name},

¡Gracias por tu compra! 🙌
Si necesitas ayuda con algo, responde este correo y con gusto te atiendo.

Un saludo,
Equipo
"""
    html = f"""
    <div style="font-family: Arial, sans-serif; line-height:1.5">
      <p>Hola <b>{name}</b>,</p>
      <p>¡Gracias por tu compra! 🙌</p>
      <p>Si necesitas ayuda con algo, responde este correo y con gusto te atiendo.</p>
      <p>Un saludo,<br/>Equipo</p>
    </div>
    """
    return subject, text, html
