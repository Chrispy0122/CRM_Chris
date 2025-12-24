import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# Cargar variables de entorno
load_dotenv()

# --- Configuración de Base de Datos (Aiven MySQL) ---
# Formato esperado: mysql+pymysql://usuario:password@host:port/nombre_bd
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("ADVERTENCIA: DATABASE_URL no está configurada. La base de datos no funcionará.")

engine = create_engine(DATABASE_URL) if DATABASE_URL else None
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) if engine else None
Base = declarative_base()

app = FastAPI(title="Canvas Mini-CRM Backend")

# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Modelos SQLAlchemy (Base de Datos) ---
# --- Modelos SQLAlchemy (Base de Datos) ---
class ClientModel(Base):
    __tablename__ = "clients"

    id_clients = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    phone_number = Column(String(50))
    email = Column(String(255), index=True)
    purchased_item = Column(String(255))
    note = Column(Text, nullable=True)
    # created_at no existe en la BD actual


# Crear tablas si no existen (Solo para desarrollo rápido, idealmente usar Alembic)
if engine:
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Error conectando a BD: {e}")

# --- Dependencia de Base de Datos ---
def get_db():
    if not SessionLocal:
        raise HTTPException(status_code=503, detail="Base de datos no configurada")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Esquemas Pydantic (Validación de Datos) ---
class ClientBase(BaseModel):
    name: str
    phone_number: str
    email: str
    purchased_item: str
    note: Optional[str] = None


class ClientCreate(ClientBase):
    pass

class ClientResponse(ClientBase):
    id_clients: int
    # created_at eliminado

    model_config = ConfigDict(from_attributes=True)

# --- Endpoints ---

@app.get("/")
def read_root():
    return {"message": "Canvas Mini-CRM Backend is running 🚀 (Aiven MySQL Edition)"}

@app.get("/clients", response_model=List[ClientResponse])
def get_clients(db: Session = Depends(get_db)):
    try:
        # Ordenar por ID descendente ya que no hay created_at
        clients = db.query(ClientModel).order_by(ClientModel.id_clients.desc()).all()
        return clients
    except Exception as e:
        print(f"DEBUG ERROR GET: {e}")
        raise HTTPException(status_code=500, detail=f"Error consultando BD: {str(e)}")

@app.post("/clients", response_model=ClientResponse)
def create_client(client: ClientCreate, db: Session = Depends(get_db)):
    try:
        db_client = ClientModel(**client.model_dump())
        db.add(db_client)
        db.commit()
        db.refresh(db_client)
        return db_client
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error guardando cliente: {str(e)}")


class SendThankYouRequest(BaseModel):
    id_clients: int

@app.post("/api/send-thankyou")
def send_thankyou(payload: SendThankYouRequest, db: Session = Depends(get_db)):

    client = db.query(ClientModel).filter(ClientModel.id_clients == payload.id_clients).first()
    if not client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

    if not client.email:
        raise HTTPException(status_code=400, detail="El cliente no tiene email guardado")

    # IMPORTANTE: esto asume que tienes esos módulos en tu proyecto (como en pipeline.py)
    from email_automation.src.gmail_sender import send_email
    from email_automation.src.templates import thank_you_template

    subject, text, html = thank_you_template(client.name)

    send_email(client.email, subject, text, html)

    return {"status": "sent", "to": client.email}
