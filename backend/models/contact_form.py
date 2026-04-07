# Модель заявки из формы обратной связи
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Index
from sqlalchemy.orm import relationship

try:
    from ..database import Base
except ImportError:
    from database import Base


class ContactFormSubmission(Base):
    """
    Заявки из формы обратной связи.
    """
    __tablename__ = "contact_form_submissions"

    id = Column(Integer, primary_key=True, index=True)

    # Контактные данные
    name = Column(String, nullable=False, index=True)
    phone = Column(String, nullable=True, index=True)
    email = Column(String, nullable=True, index=True)

    # Сообщение
    message = Column(Text, nullable=True)
    subject = Column(String, nullable=True)

    # Источник формы
    form_type = Column(String, nullable=True, index=True)  # 'footer', 'contact_section', etc.

    # Статус обработки
    is_processed = Column(Boolean, default=False, index=True)
    manager_comment = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    __table_args__ = (
        Index('ix_contact_submissions_processed_created', 'is_processed', 'created_at'),
    )

    def __repr__(self):
        return f"<ContactFormSubmission(id={self.id}, name='{self.name}')>"
