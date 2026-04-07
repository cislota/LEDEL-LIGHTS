# Модель лога синхронизации
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Index
from sqlalchemy.orm import relationship

try:
    from ..database import Base
except ImportError:
    from database import Base


class SyncLog(Base):
    """
    Лог синхронизации с Tilda API.
    """
    __tablename__ = "sync_logs"

    id = Column(Integer, primary_key=True, index=True)

    # Информация о синхронизации
    sync_type = Column(String, nullable=False, index=True)  # 'products', 'categories', etc.
    status = Column(String, nullable=False, index=True)  # 'success', 'error', 'partial'

    # Статистика
    items_processed = Column(Integer, default=0)
    items_created = Column(Integer, default=0)
    items_updated = Column(Integer, default=0)
    items_failed = Column(Integer, default=0)

    # Ошибки
    error_message = Column(Text, nullable=True)

    # Временные метки
    started_at = Column(DateTime, default=datetime.utcnow, index=True)
    completed_at = Column(DateTime, nullable=True)

    __table_args__ = (
        Index('ix_sync_logs_type_started', 'sync_type', 'started_at'),
    )

    def __repr__(self):
        return f"<SyncLog(id={self.id}, type='{self.sync_type}', status={self.status})>"
