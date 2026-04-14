# ============================================
# Скрипт для создания бэкапа PostgreSQL (Windows PowerShell)
# Запуск: powershell -ExecutionPolicy Bypass -File backup.ps1
# ============================================

$ErrorActionPreference = "Stop"

# ============================================
# Настройки
# ============================================
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$ProjectDir = Split-Path -Parent $ScriptDir

# Загружаем .env файл
$EnvFile = Join-Path $ProjectDir ".env"
if (Test-Path $EnvFile) {
    Get-Content $EnvFile | Where-Object { $_ -match '^\w+=' } | ForEach-Object {
        $key, $value = $_ -split '=', 2
        [Environment]::SetEnvironmentVariable($key, $value, "Process")
    }
}

# Параметры БД
$DBUser = $env:POSTGRES_USER ?? "ledl_user"
$DBPassword = $env:POSTGRES_PASSWORD ?? "ledl_pass"
$DBName = $env:POSTGRES_DB ?? "ledl_db"

# Параметры бэкапа
$BackupDir = Join-Path $ProjectDir "backups\postgres"
$RetentionDays = $env:BACKUP_RETENTION_DAYS ?? 30
$Date = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupFile = Join-Path $BackupDir "ledl_db_$Date.sql.gz"
$LogDir = Join-Path $ProjectDir "backups"
$LogFile = Join-Path $LogDir "backup.log"

# ============================================
# Функции
# ============================================

function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] $Message"
    Write-Host $logEntry
    if (-not (Test-Path $LogDir)) {
        New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
    }
    Add-Content -Path $LogFile -Value $logEntry
}

function Check-Docker {
    try {
        $null = docker --version
        return $true
    } catch {
        Write-Log "❌ ОШИБКА: Docker не установлен"
        exit 1
    }
}

function Check-DbContainer {
    $containers = docker ps --format '{{.Names}}'
    $dbContainer = $containers | Where-Object { $_ -like "*db*" } | Select-Object -First 1
    
    if (-not $dbContainer) {
        Write-Log "❌ ОШИБКА: Контейнер БД не запущен"
        exit 1
    }
    
    return $dbContainer
}

# ============================================
# Основная логика
# ============================================

Write-Log "========================================="
Write-Log "Начало бэкапа PostgreSQL"
Write-Log "========================================="

# Проверки
Check-Docker
$DbContainer = Check-DbContainer

Write-Log "📦 Контейнер БД: $DbContainer"
Write-Log "💾 База данных: $DBName"
Write-Log "📁 Файл бэкапа: $BackupFile"

# Создаём директорию для бэкапов
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
}

# Создаём бэкап
Write-Log "⏳ Создание бэкапа..."

try {
    $dumpCmd = "docker exec -t $DbContainer pg_dump -U $DBUser -d $DBName --clean --if-exists --no-owner --no-privileges"
    Invoke-Expression "$dumpCmd | docker run --rm -i alpine gzip > `"$BackupFile`""
    
    # Проверяем что файл создан
    if (Test-Path $BackupFile) {
        $fileSize = (Get-Item $BackupFile).Length
        $fileSizeMB = [math]::Round($fileSize / 1MB, 2)
        Write-Log "✅ Бэкап успешно создан: $BackupFile ($fileSizeMB MB)"
    } else {
        Write-Log "❌ ОШИБКА: Файл бэкапа не создан"
        exit 1
    }
} catch {
    Write-Log "❌ ОШИБКА при создании бэкапа: $_"
    exit 1
}

# Удаляем старые бэкапы
Write-Log "🗑️  Удаление бэкапов старше $RetentionDays дней..."

$cutoffDate = (Get-Date).AddDays(-$RetentionDays)
$oldBackups = Get-ChildItem -Path $BackupDir -Filter "ledl_db_*.sql.gz" | Where-Object { $_.LastWriteTime -lt $cutoffDate }
$deletedCount = 0

foreach ($backup in $oldBackups) {
    Remove-Item $backup.FullName -Force
    $deletedCount++
}

if ($deletedCount -gt 0) {
    Write-Log "🗑️  Удалено $deletedCount старых бэкапов"
} else {
    Write-Log "📁 Старых бэкапов для удаления не найдено"
}

# Показываем статистику
$totalBackups = (Get-ChildItem -Path $BackupDir -Filter "ledl_db_*.sql.gz" -ErrorAction SilentlyContinue).Count
Write-Log "📊 Статистика:"
Write-Log "   Всего бэкапов: $totalBackups"
Write-Log ""
Write-Log "Последние 5 бэкапов:"
Get-ChildItem -Path $BackupDir -Filter "ledl_db_*.sql.gz" -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 5 |
    ForEach-Object {
        Write-Log "   $($_.Name) ($([math]::Round($_.Length / 1MB, 2)) MB)"
    }

Write-Log "========================================="
Write-Log "Бэкап завершён успешно"
Write-Log "========================================="

exit 0
