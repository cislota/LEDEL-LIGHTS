#!/bin/bash
# ============================================
# Скрипт для создания бэкапа PostgreSQL
# Запуск: ./backup.sh
# Cron: 0 2 * * * /path/to/backup.sh >> /var/log/backup.log 2>&1
# ============================================

set -e

# ============================================
# Настройки (из .env или значения по умолчанию)
# ============================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Загружаем переменные из .env если существует
if [ -f "$PROJECT_DIR/.env" ]; then
    export $(grep -v '^#' "$PROJECT_DIR/.env" | xargs)
fi

# Параметры БД
DB_USER="${POSTGRES_USER:-ledl_user}"
DB_PASSWORD="${POSTGRES_PASSWORD:-ledl_pass}"
DB_NAME="${POSTGRES_DB:-ledl_db}"
DB_HOST="${POSTGRES_HOST:-localhost}"
DB_PORT="${POSTGRES_PORT:-5432}"

# Параметры бэкапа
BACKUP_DIR="${PROJECT_DIR}/backups/postgres"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/ledl_db_${DATE}.sql.gz"
LOG_FILE="$PROJECT_DIR/backups/backup.log"

# ============================================
# Функции
# ============================================

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        log "❌ ОШИБКА: Docker не установлен"
        exit 1
    fi
}

check_db_container() {
    if ! docker ps --format '{{.Names}}' | grep -q "ledl.*db\|db"; then
        log "❌ ОШИБКА: Контейнер БД не запущен"
        exit 1
    fi
}

# ============================================
# Основная логика
# ============================================

log "========================================="
log "Начало бэкапа PostgreSQL"
log "========================================="

# Проверки
check_docker
check_db_container

# Создаём директорию для бэкапов
mkdir -p "$BACKUP_DIR"

# Находим имя контейнера БД
DB_CONTAINER=$(docker ps --filter "name=db" --format '{{.Names}}' | head -n1)

if [ -z "$DB_CONTAINER" ]; then
    log "❌ ОШИБКА: Контейнер БД не найден"
    exit 1
fi

log "📦 Контейнер БД: $DB_CONTAINER"
log "💾 База данных: $DB_NAME"
log "📁 Файл бэкапа: $BACKUP_FILE"

# Создаём бэкап
log "⏳ Создание бэкапа..."

docker exec -t "$DB_CONTAINER" pg_dump \
    -U "$DB_USER" \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -d "$DB_NAME" \
    --clean \
    --if-exists \
    --no-owner \
    --no-privileges \
    | gzip > "$BACKUP_FILE"

# Проверяем что файл создан
if [ -f "$BACKUP_FILE" ]; then
    FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    log "✅ Бэкап успешно создан: $BACKUP_FILE ($FILE_SIZE)"
else
    log "❌ ОШИБКА: Файл бэкапа не создан"
    exit 1
fi

# Удаляем старые бэкапы
log "🗑️  Удаление бэкапов старше $RETENTION_DAYS дней..."

DELETED_COUNT=$(find "$BACKUP_DIR" -name "ledl_db_*.sql.gz" -mtime +$RETENTION_DAYS -delete -print | wc -l)

if [ "$DELETED_COUNT" -gt 0 ]; then
    log "🗑️  Удалено $DELETED_COUNT старых бэкапов"
else
    log "📁 Старых бэкапов для удаления не найдено"
fi

# Показываем статистику
TOTAL_BACKUPS=$(ls -1 "$BACKUP_DIR"/ledl_db_*.sql.gz 2>/dev/null | wc -l)
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1)

log "📊 Статистика:"
log "   Всего бэкапов: $TOTAL_BACKUPS"
log "   Общий размер: $TOTAL_SIZE"
log ""
log "Последние 5 бэкапов:"
ls -lht "$BACKUP_DIR"/ledl_db_*.sql.gz 2>/dev/null | head -5 | while read line; do
    log "   $line"
done

log "========================================="
log "Бэкап завершён успешно"
log "========================================="

exit 0
