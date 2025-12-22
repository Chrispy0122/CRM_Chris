import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Agregar el directorio actual al path para asegurar imports correctos si fuera necesario
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Cargar variables de entorno
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def test_connection():
    if not DATABASE_URL:
        print("❌ ERROR: DATABASE_URL no encontrada en las variables de entorno.")
        return

    print(f"Intentando conectar a: {DATABASE_URL.split('@')[-1]}") # Mostrar solo host por seguridad

    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("  CONEXION EXITOSA!")
            
            # Listar tablas
            print("\n  Listado de tablas:")
            result_tables = connection.execute(text("SHOW TABLES"))
            tables = result_tables.fetchall()
            if tables:
                for table in tables:
                    table_name = table[0]
                    print(f"   - Tabla: {table_name}")
                    
                    # Mostrar columnas de la tabla
                    try:
                        result_columns = connection.execute(text(f"SHOW COLUMNS FROM {table_name}"))
                        print("     Columnas:")
                        for col in result_columns:
                            # col[0] es Field, col[1] es Type, etc.
                            print(f"       * {col[0]} ({col[1]})")
                    except Exception as e_col:
                        print(f"       ERROR al leer columnas: {e_col}")

                    # Mostrar contenido de la tabla (limitado a 5 filas por seguridad de visualización)
                    try:
                        print("     Contenido (primeras 5 filas):")
                        result_rows = connection.execute(text(f"SELECT * FROM {table_name} LIMIT 5"))
                        rows = result_rows.fetchall()
                        if rows:
                            for row in rows:
                                print(f"       - {row}")
                        else:
                            print("       (Tabla vacía)")
                    except Exception as e_rows:
                        print(f"       ERROR al leer contenido: {e_rows}")

            else:
                print("   No hay tablas en la base de datos.")

    except Exception as e:
        print(f"  ERROR: Fallo la conexion a la base de datos.")
        print(f"   Detalle: {e}")

if __name__ == "__main__":
    test_connection()
