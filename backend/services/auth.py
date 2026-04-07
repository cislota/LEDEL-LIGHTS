# JWT аутентификация для админ-панели
import os
from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext

from ..config import ADMIN_USERNAME, ADMIN_PASSWORD

# === Конфигурация ===

# Секретный ключ для подписи JWT (из env или генерируется)
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "480"))  # 8 часов

# Хэширование паролей
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()


# === Утилиты ===

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Проверяет пароль против хэша."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Хэширует пароль."""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Создаёт JWT токен.

    Args:
        data: Данные для включения в токен (sub, role, etc.)
        expires_delta: Время жизни токена

    Returns:
        JWT токен в виде строки
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> Optional[dict]:
    """
    Декодирует и валидирует JWT токен.

    Args:
        token: JWT токен

    Returns:
        Payload токена или None при ошибке
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


# === FastAPI зависимости (Dependencies) ===

async def get_current_admin_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """
    Проверяет JWT токен и возвращает данные текущего администратора.
    Используется как Depends в защищённых эндпоинтах.

    Raises:
        HTTPException: 401 при невалидном токене
    """
    token = credentials.credentials
    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный или истёкший токен авторизации",
            headers={"WWW-Authenticate": "Bearer"},
        )

    username: str = payload.get("sub")
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Токен не содержит идентификатора пользователя",
        )

    return payload


async def require_admin(
    current_user: dict = Depends(get_current_admin_user)
) -> dict:
    """
    Проверяет, что текущий пользователь — администратор.
    Можно использовать как Depends в эндпоинтах.
    """
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Недостаточно прав для выполнения операции",
        )
    return current_user


# === Эндпоинт логина ===

class LoginRequest:
    """Схема для запроса логина (Pydantic модель в schemas.py)."""
    pass  # Используется из schemas.py


class TokenResponse:
    """Схема для ответа с токеном."""
    pass  # Используется из schemas.py


def authenticate_user(username: str, password: str) -> bool:
    """
    Проверяет учётные данные пользователя.

    Args:
        username: Имя пользователя
        password: Пароль

    Returns:
        True если аутентификация успешна
    """
    return username == ADMIN_USERNAME and password == ADMIN_PASSWORD


def login_for_access_token(username: str, password: str) -> dict:
    """
    Аутентифицирует пользователя и возвращает JWT токен.

    Args:
        username: Имя пользователя
        password: Пароль

    Returns:
        Словарь с access_token и token_type

    Raises:
        HTTPException: 401 при неверных учётных данных
    """
    if not authenticate_user(username, password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверное имя пользователя или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Создаём токен
    access_token = create_access_token(
        data={
            "sub": username,
            "role": "admin",
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,  # в секундах
    }
