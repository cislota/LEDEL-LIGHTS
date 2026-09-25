FROM python:3.11-slim

WORKDIR /app

# Установка системных зависимостей
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Копирование и установка Python зависимостей
COPY backend/requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt

# Копирование исходного кода
COPY backend/ /app/backend

# Переменная окружения для Python
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONPATH=/app

# Экспортируем порт
EXPOSE 8000

# Запуск приложения
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
