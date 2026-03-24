# API роутеры для результатов квиза
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import math

from ..database import get_db
from .. import schemas, crud

router = APIRouter(prefix="/api/quiz", tags=["quiz"])


@router.post("/results", response_model=schemas.QuizResultResponse)
def create_quiz_result(
    result: schemas.QuizResultCreate,
    db: Session = Depends(get_db),
):
    """
    Сохранить результат прохождения квиза.
    """
    return crud.create_quiz_result(db=db, result=result)


@router.get("/results", response_model=List[schemas.QuizResultResponse])
def list_quiz_results(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    is_processed: Optional[bool] = None,
    db: Session = Depends(get_db),
):
    """
    Получить список результатов квиза.
    """
    skip = (page - 1) * page_size
    return crud.get_quiz_results(
        db=db,
        skip=skip,
        limit=page_size,
        is_processed=is_processed,
    )


@router.get("/results/{result_id}", response_model=schemas.QuizResultResponse)
def get_quiz_result(result_id: int, db: Session = Depends(get_db)):
    """
    Получить результат квиза по ID.
    """
    result = crud.get_quiz_result(db, result_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Quiz result not found")
    return result
