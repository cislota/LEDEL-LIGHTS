# Модель категории
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Index
from sqlalchemy.orm import relationship

try:
    from ..database import Base
except ImportError:
    from database import Base


class Category(Base):
    """
    Модель категории товаров.
    """
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=True)
    description = Column(Text, nullable=True)
    parent_id = Column(Integer, ForeignKey("categories.id"), nullable=True, index=True)
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True, index=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Связи
    parent = relationship("Category", remote_side=[id], backref="children")

    __table_args__ = (
        Index('ix_categories_parent', 'parent_id'),
    )

    def __repr__(self):
        return f"<Category(id={self.id}, name='{self.name}')>"
