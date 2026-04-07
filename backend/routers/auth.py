# API роутеры для аутентификации
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer

from .. import schemas
from ..services.auth import (
    login_for_access_token,
    get_current_admin_user,
    require_admin,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=schemas.TokenResponse)
def login(login_data: schemas.LoginRequest):
    """
    Аутентификация администратора и получение JWT токена.

    После получения токена используйте его в заголовке:
    `Authorization: Bearer <token>`
    """
    return login_for_access_token(
        username=login_data.username,
        password=login_data.password,
    )


@router.get("/me", response_model=schemas.APIResponse)
def get_current_user(current_user: dict = Depends(require_admin)):
    """
    Получить информацию о текущем пользователе.
    Только для авторизованных администраторов.
    """
    return schemas.APIResponse(
        success=True,
        message="Информация о пользователе получена",
        data={
            "username": current_user.get("sub"),
            "role": current_user.get("role"),
            "exp": current_user.get("exp"),
        },
    )


@router.post("/verify", response_model=schemas.APIResponse)
def verify_token(current_user: dict = Depends(require_admin)):
    """
    Проверить валидность токена.
    Используется на фронтенде для проверки сессии.
    """
    return schemas.APIResponse(
        success=True,
        message="Токен валиден",
        data={
            "username": current_user.get("sub"),
            "role": current_user.get("role"),
        },
    )
