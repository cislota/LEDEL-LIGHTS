# API роутеры для результатов квиза
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel

from ..database import get_db
from .. import schemas, crud
from ..models.quiz_result import QuizResult

router = APIRouter(prefix="/api/quiz", tags=["quiz"])


@router.post("/results", response_model=schemas.QuizResultResponse)
def create_quiz_result(
    result: schemas.QuizResultCreate,
    db: Session = Depends(get_db),
):
    """Сохранить результат прохождения квиза."""
    return crud.create_quiz_result(db=db, result=result)


@router.get("/results", response_model=schemas.QuizResultListResponse)
def list_quiz_results(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    is_processed: Optional[bool] = None,
    db: Session = Depends(get_db),
):
    """Получить список результатов квиза с пагинацией."""
    skip = (page - 1) * page_size
    results = crud.get_quiz_results(
        db=db,
        skip=skip,
        limit=page_size,
        is_processed=is_processed,
    )

    total_query = db.query(QuizResult)
    if is_processed is not None:
        total_query = total_query.filter(QuizResult.is_processed == is_processed)
    total = total_query.count()

    # Преобразуем SQLAlchemy модели в QuizResultSummary
    items = [schemas.QuizResultSummary.model_validate(r) for r in results]

    return schemas.QuizResultListResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/results/{result_id}", response_model=schemas.QuizResultResponse)
def get_quiz_result(result_id: int, db: Session = Depends(get_db)):
    """Получить результат квиза по ID."""
    result = crud.get_quiz_result(db, result_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Quiz result not found")
    return result
