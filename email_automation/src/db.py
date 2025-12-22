from __future__ import annotations

from dotenv import load_dotenv
load_dotenv()

import os
from dataclasses import dataclass
from typing import List, Optional

from sqlalchemy import create_engine, text


@dataclass
class Recipient:
    name: str
    email: str


def _normalize_mysql_url(url: str) -> str:
    if url.startswith("mysql://"):
        return url.replace("mysql://", "mysql+pymysql://", 1)
    return url


def fetch_recipients(limit: Optional[int] = None) -> List[Recipient]:
    mysql_url = os.getenv("MYSQL_URL", "").strip()
    if not mysql_url:
        raise ValueError("Falta MYSQL_URL en el .env")

    mysql_url = _normalize_mysql_url(mysql_url)

    engine = create_engine(
        mysql_url,
        pool_pre_ping=True,
        connect_args={
            "ssl": {"ssl": True}  # ✅ Aiven SSL correcto
        },
    )

    sql = """
        SELECT name, email
        FROM clients
        WHERE email IS NOT NULL AND email <> ''
    """
    if limit:
        sql += " LIMIT :limit"

    with engine.connect() as conn:
        rows = conn.execute(
            text(sql),
            {"limit": limit} if limit else {}
        ).fetchall()

    return [
        Recipient(
            name=(name or "amigo/a"),
            email=email.strip()
        )
        for name, email in rows
    ]
