# 💾 Бэкап и восстановление PostgreSQL

> **Важность:** Критически важно для production!
> 
> **Рекомендуемая частота:** Каждый день (или каждые 6 часов для активных проектов)

---

## 📋 Быстрый старт

### Создание бэкапа

**Linux/macOS:**
```bash
./scripts/backup.sh
```

**Windows (PowerShell):**
```powershell
powershell -ExecutionPolicy Bypass -File scripts\backup.ps1
```

### Восстановление из бэкапа

**Linux/macOS:**
```bash
# Интерактивный выбор
./scripts/restore.sh

# Конкретный файл
./scripts/restore.sh backups/postgres/ledl_db_20260413_120000.sql.gz

# Без подтверждения
./scripts/restore.sh backups/postgres/ledl_db_20260413_120000.sql.gz --force
```

**Windows (PowerShell):**
```powershell
# Интерактивный выбор
powershell -ExecutionPolicy Bypass -File scripts\restore.ps1

# Конкретный файл
powershell -ExecutionPolicy Bypass -File scripts\restore.ps1 backups\postgres\ledl_db_20260413_120000.sql.gz
```

---

## 🔄 Автобэкап через cron (Linux/macOS)

### Настройка

```bash
# Открываем crontab
crontab -e

# Добавляем строку (каждый день в 2:00 ночи)
0 2 * * * /path/to/LEDEL-LIGHTS/scripts/backup.sh >> /path/to/LEDEL-LIGHTS/backups/backup.log 2>&1
```

### Проверка

```bash
# Показываем текущие cron задачи
crontab -l

# Проверяем логи
tail -f /path/to/LEDEL-LIGHTS/backups/backup.log
```

---

## 📁 Структура файлов бэкапов

```
backups/
├── postgres/
│   ├── ledl_db_20260413_020000.sql.gz  # Ежедневный бэкап
│   ├── ledl_db_20260412_020000.sql.gz
│   ├── ledl_db_20260411_020000.sql.gz
│   └── ...
└── backup.log                          # Лог операций
```

**Формат имени файла:** `ledl_db_ГГГГММДД_ЧЧММСС.sql.gz`

**Хранение:** По умолчанию 30 дней (настраивается через `BACKUP_RETENTION_DAYS` в `.env`)

---

## ⚙️ Настройки

### Переменные окружения (в `.env`)

| Переменная | Значение по умолчанию | Описание |
|------------|----------------------|----------|
| `POSTGRES_USER` | `ledl_user` | Пользователь БД |
| `POSTGRES_PASSWORD` | `ledl_pass` | Пароль БД |
| `POSTGRES_DB` | `ledl_db` | Имя базы данных |
| `BACKUP_RETENTION_DAYS` | `30` | Сколько дней хранить бэкапы |

### Пример настройки в `.env`:

```env
# Хранить бэкапы 60 дней вместо 30
BACKUP_RETENTION_DAYS=60
```

---

## 🛡️ Безопасность

### Что включено в бэкап:

- ✅ Все таблицы (products, orders, categories, quiz_results, contact_form_submissions, sync_logs)
- ✅ Все данные (заказы, заявки, товары, настройки)
- ✅ Структура базы данных

### Что НЕ включено:

- ❌ Пользователи и роли (создаются при инициализации БД)
- ❌ Файлы сертификатов SSL
- ❌ Медиа файлы (если хранятся отдельно)

### Автоматический бэкап перед восстановлением:

Скрипт `restore.sh` **автоматически создаёт бэкап** текущей базы перед восстановлением. Файл сохраняется как:
```
backups/postgres/ledl_db_pre_restore_ГГГГММДД_ЧЧММСС.sql.gz
```

---

## 🧪 Тестирование бэкапа

### Проверка целостности бэкапа

```bash
# Проверяем что файл не битый
gzip -t backups/postgres/ledl_db_20260413_020000.sql.gz

# Показываем первые строки
zcat backups/postgres/ledl_db_20260413_020000.sql.gz | head -20
```

### Тестовое восстановление

```bash
# 1. Создаём тестовую базу
docker run --name test-db -e POSTGRES_PASSWORD=test -d postgres:15

# 2. Восстанавливаем из бэкапа
docker cp backups/postgres/ledl_db_20260413_020000.sql.gz test-db:/tmp/restore.sql.gz
docker exec test-db bash -c "gunzip -c /tmp/restore.sql.gz | psql -U postgres"

# 3. Проверяем
docker exec -it test-db psql -U postgres -c "\dt"

# 4. Удаляем тестовый контейнер
docker rm -f test-db
```

---

## 📊 Размер бэкапов

| Количество товаров | Размер бэкапа (сжатый) |
|-------------------|------------------------|
| 100 товаров | ~50 KB |
| 1,000 товаров | ~200 KB |
| 10,000 товаров | ~2 MB |
| 100,000 товаров | ~20 MB |

**Примечание:** Зависит от количества заказов и заявок.

---

## 🚨 Экстренное восстановление

### Если база данных полностью повреждена:

```bash
# 1. Останавливаем всё
docker compose down

# 2. Пересоздаём БД
docker compose up -d db

# 3. Ждём инициализации (10-30 секунд)
sleep 30

# 4. Восстанавливаем из последнего бэкапа
./scripts/restore.sh $(ls -t backups/postgres/ledl_db_*.sql.gz | head -1) --force

# 5. Перезапускаем сервисы
docker compose restart
```

### Если бэкапы отсутствуют:

```bash
# Синхронизируем товары из Tilda
curl -X POST http://localhost:8000/api/products/admin/sync/tilda \
  -H "Authorization: Bearer <token>"

# Заказы и заявки, к сожалению, будут потеряны
```

---

## 🔗 Список команд

```bash
# Показать все бэкапы
ls -lht backups/postgres/

# Показать размер директории бэкапов
du -sh backups/

# Удалить все бэкапы старше 7 дней
find backups/postgres -name "*.sql.gz" -mtime +7 -delete

# Экспорт одной таблицы
docker exec db pg_dump -U ledl_user -d ledl_db -t orders > orders_backup.sql

# Импорт одной таблицы
docker exec -i db psql -U ledl_user -d ledl_db < orders_backup.sql
```

---

**Документ создан:** 13 апреля 2026 г.
**Версия проекта:** 2.0.0
**Автор:** LEDS-LIGHTS Development Team
