# 🔒 Настройка SSL/HTTPS

## 📋 Варианты настройки

| Вариант | Для чего | Сложность |
|---------|----------|-----------|
| **A. Self-signed сертификат** | Локальная разработка, тестирование | ⭐ Простая |
| **B. Let's Encrypt** | Production сервер с реальным доменом | ⭐⭐ Средняя |

---

## Вариант A: Self-signed сертификат (для тестирования)

### Инструкция

**1. Запустите скрипт генерации:**

Windows (PowerShell):
```powershell
cd nginx\ssl
powershell -ExecutionPolicy Bypass -File generate-self-signed.ps1
```

Linux/macOS:
```bash
cd nginx/ssl
openssl genrsa -out privkey.pem 2048
openssl req -new -x509 -key privkey.pem -out fullchain.pem -days 365 -nodes \
    -subj "/C=RU/ST=Moscow/L=Moscow/O=LEDS-LIGHTS/OU=IT/CN=localhost"
```

**2. Перезапустите nginx:**
```bash
docker-compose restart nginx
```

**3. Проверьте:**
Откройте браузер и перейдите на `https://localhost`

⚠️ **Браузер покажет предупреждение** — это нормально для self-signed сертификата.
Нажмите "Дополнительно" → "Перейти на сайт (небезопасно)".

---

## Вариант B: Let's Encrypt (для Production)

### Предварительные требования

- ✅ Зарегистрированный домен (например, `leds-lights.ru`)
- ✅ DNS настроен на ваш сервер (A запись → IP сервера)
- ✅ Сервер доступен из интернета
- ✅ Порты 80 и 443 открыты

### Инструкция

**1. Настройте DNS**

Создайте A запись в панели управления доменом:
```
Тип: A
Имя: @ (или leds-lights.ru)
Значение: <IP вашего сервера>
TTL: 300
```

**2. Обновите `.env` файл**

```env
SSL_DOMAIN=leds-lights.ru
NEXT_PUBLIC_API_BASE_URL=https://leds-lights.ru/api
ALLOWED_ORIGINS=https://leds-lights.ru,https://www.leds-lights.ru
```

**3. Обновите `nginx/nginx.conf`**

Замените все `localhost` на ваш домен:
```nginx
server_name leds-lights.ru www.leds-lights.ru;
```

**4. Получите сертификаты:**

Linux:
```bash
chmod +x nginx/ssl/obtain-letsencrypt.sh
./nginx/ssl/obtain-letsencrypt.sh leds-lights.ru admin@leds-lights.ru
```

Вручную (любая ОС):
```bash
# Создаём директории
mkdir -p nginx/ssl nginx/certbot/www

# Запускаем certbot через Docker
docker run --rm \
    -v "$(pwd)/nginx/certbot/www:/var/www/certbot" \
    -v "$(pwd)/nginx/ssl:/etc/letsencrypt" \
    certbot/certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email admin@leds-lights.ru \
    --agree-tos \
    --no-eff-email \
    -d leds-lights.ru \
    -d www.leds-lights.ru

# Копируем сертификаты
cp nginx/ssl/live/leds-lights.ru/fullchain.pem nginx/ssl/fullchain.pem
cp nginx/ssl/live/leds-lights.ru/privkey.pem nginx/ssl/privkey.pem
```

**5. Перезапустите nginx:**
```bash
docker-compose restart nginx
```

**6. Проверьте:**
Откройте `https://leds-lights.ru` — должно работать без предупреждений!

---

## 🔄 Автообновление сертификатов

Let's Encrypt сертификаты действительны 90 дней. Настройте автообновление:

**Linux (crontab):**
```bash
crontab -e

# Добавить строку (обновление каждый понедельник в 3:00):
0 3 * * 1 cd /path/to/LEDEL-LIGHTS && ./nginx/ssl/obtain-letsencrypt.sh leds-lights.ru && docker-compose restart nginx
```

**Windows (Task Scheduler):**
Используйте Task Scheduler для еженедельного запуска:
```powershell
docker-compose restart nginx
```

---

## 🛠️ Диагностика

### Проверка сертификата
```bash
# Проверить SSL подключение
curl -vI https://localhost

# Проверить сертификат
openssl s_client -connect localhost:443 -servername localhost
```

### Проверка nginx конфигурации
```bash
docker exec ledl-lights-nginx-1 nginx -t
```

### Просмотр логов nginx
```bash
docker-compose logs nginx
```

### Сертификат истекает скоро?
```bash
openssl x509 -checkend 2592000 -noout -in nginx/ssl/fullchain.pem
# 2592000 = 30 дней в секундах
# Вернёт 0 если сертификат действителен ещё 30+ дней
# Вернёт 1 если истекает менее чем через 30 дней
```

---

## ⚠️ Troubleshooting

### Ошибка: `SSL: error:02001002:system library:fopen:No such file`

**Причина:** Файлы сертификатов не найдены.

**Решение:** Сгенерируйте сертификаты (см. Вариант A или B выше).

### Ошибка: `nginx: [emerg] cannot load certificate`

**Причина:** Неправильный путь к сертификатам или нет доступа.

**Решение:** Проверьте что файлы существуют:
```bash
ls -la nginx/ssl/
# Должны быть: fullchain.pem, privkey.pem
```

### Браузер показывает "Небезопасно"

**Для self-signed:** Это нормально! Нажмите "Дополнительно" → "Перейти".

**Для Let's Encrypt:** Проверьте:
1. Домен правильно настроен в DNS
2. Порт 80 доступен (нужен для валидации)
3. Сертификаты не истекли

---

## 📁 Структура файлов

```
nginx/
├── nginx.conf              # Конфигурация nginx (с SSL)
├── ssl/
│   ├── fullchain.pem       # SSL сертификат (сгенерировать)
│   ├── privkey.pem         # Приватный ключ (сгенерировать)
│   ├── generate-self-signed.ps1  # Скрипт для self-signed
│   ├── obtain-letsencrypt.sh     # Скрипт для Let's Encrypt
│   └── README.md           # Этот файл
└── certbot/
    └── www/                # Для Let's Encrypt challenge
```
