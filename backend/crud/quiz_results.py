# CRUD операции для результатов квиза
from typing import Optional, List
from sqlalchemy.orm import Session

from .. import models, schemas


def get_quiz_result(db: Session, result_id: int) -> Optional[models.QuizResult]:
    """Получить результат квиза по ID"""
    return db.query(models.QuizResult).filter(models.QuizResult.id == result_id).first()


def get_quiz_results(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    is_processed: Optional[bool] = None,
) -> List[models.QuizResult]:
    """Получить список результатов квиза"""
    query = db.query(models.QuizResult)

    if is_processed is not None:
        query = query.filter(models.QuizResult.is_processed == is_processed)

    return query.order_by(models.QuizResult.created_at.desc()).offset(skip).limit(limit).all()


def create_quiz_result(
    db: Session, result: schemas.QuizResultCreate
) -> models.QuizResult:
    """Создать результат квиза"""
    db_result = models.QuizResult(
        name=result.name,
        phone=result.phone,
        email=result.email,
        answers=result.answers,
        result_type=result.result_type,
        recommended_products=result.recommended_products,
        is_processed=False,
    )
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    return db_result


def mark_quiz_result_processed(
    db: Session, result_id: int, manager_comment: Optional[str] = None
) -> Optional[models.QuizResult]:
    """Отметить результат квиза как обработанный"""
    db_result = get_quiz_result(db, result_id)
    if db_result is None:
        return None

    db_result.is_processed = True
    if manager_comment:
        db_result.manager_comment = manager_comment

    db.commit()
    db.refresh(db_result)
    return db_result
