# API роутеры для форм обратной связи
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import math

from ..database import get_db
from .. import schemas, crud

router = APIRouter(prefix="/api/contact", tags=["contact"])


@router.post("/submit", response_model=schemas.ContactFormResponse)
def submit_contact_form(
    submission: schemas.ContactFormCreate,
    db: Session = Depends(get_db),
):
    """
    Отправить заявку из формы обратной связи.
    """
    return crud.create_contact_form_submission(db=db, submission=submission)


@router.get("/submissions", response_model=List[schemas.ContactFormResponse])
def list_contact_form_submissions(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    is_processed: Optional[bool] = None,
    form_type: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """
    Получить список заявок из форм.
    """
    skip = (page - 1) * page_size
    return crud.get_contact_form_submissions(
        db=db,
        skip=skip,
        limit=page_size,
        is_processed=is_processed,
        form_type=form_type,
    )


@router.get("/submissions/{submission_id}", response_model=schemas.ContactFormResponse)
def get_contact_form_submission(submission_id: int, db: Session = Depends(get_db)):
    """
    Получить заявку по ID.
    """
    submission = crud.get_contact_form_submission(db, submission_id)
    if submission is None:
        raise HTTPException(status_code=404, detail="Submission not found")
    return submission
