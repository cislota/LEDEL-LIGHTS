# Модель результата квиза
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Index
from sqlalchemy.orm import relationship

try:
    from ..database import Base
except ImportError:
    from database import Base


class QuizResult(Base):
    """
    Результаты прохождения квиза.
    """
    __tablename__ = "quiz_results"

    id = Column(Integer, primary_key=True, index=True)

    # Контактные данные
    name = Column(String, nullable=True, index=True)
    phone = Column(String, nullable=True, index=True)
    email = Column(String, nullable=True, index=True)

    # Данные квиза (JSON)
    answers = Column(Text, nullable=False)  # JSON с ответами
    result_type = Column(String, nullable=True)  # Тип результата
    recommended_products = Column(Text, nullable=True)  # JSON с рекомендованными товарами

    # Статус обработки
    is_processed = Column(Boolean, default=False, index=True)
    manager_comment = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    __table_args__ = (
        Index('ix_quiz_results_processed_created', 'is_processed', 'created_at'),
    )

    def __repr__(self):
        return f"<QuizResult(id={self.id}, name='{self.name}')>"
