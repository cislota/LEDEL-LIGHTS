# Database connection and session management
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

try:
    from .config import DATABASE_URL
except ImportError:
    from config import DATABASE_URL

# Создание движка SQLAlchemy
engine = create_engine(DATABASE_URL)

# Сессия для работы с БД
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Базовый класс для моделей
Base = declarative_base()


def get_db():
    """
    Dependency для получения сессии БД.
    Автоматически закрывает сессию после использования.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
