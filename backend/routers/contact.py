# API роутеры для форм обратной связи
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel

from ..database import get_db
from .. import schemas, crud
from ..models.contact_form import ContactFormSubmission

router = APIRouter(prefix="/api/contact", tags=["contact"])


@router.post("/submit", response_model=schemas.ContactFormResponse)
def submit_contact_form(
    submission: schemas.ContactFormCreate,
    db: Session = Depends(get_db),
):
    """Отправить заявку из формы обратной связи."""
    return crud.create_contact_form_submission(db=db, submission=submission)


class ContactFormListResponse(BaseModel):
    items: list
    total: int
    page: int
    page_size: int


@router.get("/submissions", response_model=schemas.ContactFormListResponse)
def list_contact_form_submissions(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    is_processed: Optional[bool] = None,
    form_type: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Получить список заявок из форм с пагинацией."""
    skip = (page - 1) * page_size
    submissions = crud.get_contact_form_submissions(
        db=db,
        skip=skip,
        limit=page_size,
        is_processed=is_processed,
        form_type=form_type,
    )

    total_query = db.query(ContactFormSubmission)
    if is_processed is not None:
        total_query = total_query.filter(ContactFormSubmission.is_processed == is_processed)
    if form_type is not None:
        total_query = total_query.filter(ContactFormSubmission.form_type == form_type)
    total = total_query.count()

    # Преобразуем SQLAlchemy модели в ContactFormSummary
    items = [schemas.ContactFormSummary.model_validate(s) for s in submissions]

    return schemas.ContactFormListResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/submissions/{submission_id}", response_model=schemas.ContactFormResponse)
def get_contact_form_submission(submission_id: int, db: Session = Depends(get_db)):
    """Получить заявку по ID."""
    submission = crud.get_contact_form_submission(db, submission_id)
    if submission is None:
        raise HTTPException(status_code=404, detail="Submission not found")
    return submission
