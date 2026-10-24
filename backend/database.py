
import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, URL, text

load_dotenv()

database_url = URL.create(
    drivername="postgresql+psycopg",
    username=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST", "localhost"),
    port=int(os.getenv("DB_PORT", "5432")),
    database=os.getenv("DB_NAME"),
)

engine = create_engine(database_url, pool_pre_ping=True)


def test_connection():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT current_database()"))
        database_name = result.scalar_one()

        print(f"Successfully connected to database: {database_name}")


if __name__ == "__main__":
    test_connection()
