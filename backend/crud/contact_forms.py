# CRUD операции для заявок из форм обратной связи
from typing import Optional, List
from sqlalchemy.orm import Session

from .. import models, schemas


def get_contact_form_submission(
    db: Session, submission_id: int
) -> Optional[models.ContactFormSubmission]:
    """Получить заявку по ID"""
    return (
        db.query(models.ContactFormSubmission)
        .filter(models.ContactFormSubmission.id == submission_id)
        .first()
    )


def get_contact_form_submissions(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    is_processed: Optional[bool] = None,
    form_type: Optional[str] = None,
) -> List[models.ContactFormSubmission]:
    """Получить список заявок"""
    query = db.query(models.ContactFormSubmission)

    if is_processed is not None:
        query = query.filter(models.ContactFormSubmission.is_processed == is_processed)

    if form_type is not None:
        query = query.filter(models.ContactFormSubmission.form_type == form_type)

    return query.order_by(models.ContactFormSubmission.created_at.desc()).offset(skip).limit(limit).all()


def create_contact_form_submission(
    db: Session, submission: schemas.ContactFormCreate
) -> models.ContactFormSubmission:
    """Создать заявку из формы обратной связи"""
    db_submission = models.ContactFormSubmission(
        name=submission.name,
        phone=submission.phone,
        email=submission.email,
        message=submission.message,
        subject=submission.subject,
        form_type=submission.form_type,
        is_processed=False,
    )
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    return db_submission


def mark_contact_form_processed(
    db: Session, submission_id: int, manager_comment: Optional[str] = None
) -> Optional[models.ContactFormSubmission]:
    """Отметить заявку как обработанную"""
    db_submission = get_contact_form_submission(db, submission_id)
    if db_submission is None:
        return None

    db_submission.is_processed = True
    if manager_comment:
        db_submission.manager_comment = manager_comment

    db.commit()
    db.refresh(db_submission)
    return db_submission
