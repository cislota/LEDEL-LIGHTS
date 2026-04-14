#!/bin/bash
# Скрипт для получения SSL сертификатов Let's Encrypt (Production)
# Запуск: ./obtain-letsencrypt.sh yourdomain.com
# Требует: certbot, Docker, доступ к домену из интернета

set -e

DOMAIN=${1:-""}
EMAIL=${2:-""}

if [ -z "$DOMAIN" ]; then
    echo "============================================"
    echo "Получение SSL Сертификатов Let's Encrypt"
    echo "============================================"
    echo ""
    echo "Использование: $0 <domain> [email]"
    echo ""
    echo "Примеры:"
    echo "  $0 yourdomain.com"
    echo "  $0 yourdomain.com admin@yourdomain.com"
    echo ""
    exit 1
fi

if [ -z "$EMAIL" ]; then
    EMAIL="admin@$DOMAIN"
fi

SSL_DIR="./nginx/ssl"
CERTBOT_WWW="./nginx/certbot/www"

# Создаём директории
mkdir -p "$SSL_DIR"
mkdir -p "$CERTBOT_WWW"

echo "============================================"
echo "Получение SSL Сертификатов Let's Encrypt"
echo "============================================"
echo ""
echo "Домен: $DOMAIN"
echo "Email: $EMAIL"
echo ""

# Проверяем существуют ли уже сертификаты
if [ -f "$SSL_DIR/fullchain.pem" ] && [ -f "$SSL_DIR/privkey.pem" ]; then
    echo "⚠️  SSL сертификаты уже существуют:"
    echo "   $SSL_DIR/fullchain.pem"
    echo "   $SSL_DIR/privkey.pem"
    echo ""
    read -p "Перезаписать? (y/n): " OVERWRITE
    if [ "$OVERWRITE" != "y" ]; then
        echo "Отменено."
        exit 0
    fi
fi

echo "Запуск certbot для получения сертификатов..."
echo ""

# Получаем сертификаты через certbot
docker run --rm \
    -v "$CERTBOT_WWW:/var/www/certbot" \
    -v "$SSL_DIR:/etc/letsencrypt" \
    certbot/certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN" \
    -d "www.$DOMAIN"

# Проверяем результат
if [ -f "$SSL_DIR/live/$DOMAIN/fullchain.pem" ]; then
    echo ""
    echo "✅ SSL сертификаты успешно получены!"
    echo ""
    echo "📁 Файлы:"
    echo "   Сертификат: $SSL_DIR/live/$DOMAIN/fullchain.pem"
    echo "   Приватный ключ: $SSL_DIR/live/$DOMAIN/privkey.pem"
    echo ""
    
    # Копируем в основную директорию для удобства
    cp "$SSL_DIR/live/$DOMAIN/fullchain.pem" "$SSL_DIR/fullchain.pem"
    cp "$SSL_DIR/live/$DOMAIN/privkey.pem" "$SSL_DIR/privkey.pem"
    
    echo "📋 Скопировано в:"
    echo "   $SSL_DIR/fullchain.pem"
    echo "   $SSL_DIR/privkey.pem"
    echo ""
    echo "🔄 Автообновление сертификатов (добавить в crontab):"
    echo "   0 3 * * * docker run --rm -v ./nginx/ssl:/etc/letsencrypt -v ./nginx/certbot/www:/var/www/certbot certbot/certbot renew --webroot --webroot-path=/var/www/certbot && docker-compose restart nginx"
    echo ""
else
    echo ""
    echo "❌ Ошибка получения сертификатов!"
    echo "   Проверьте что:"
    echo "   - Домен $DOMAIN доступен из интернета"
    echo "   - Порт 80 открыт"
    echo "   - DNS настроен правильно"
    exit 1
fi
