"""
Тест проверки JWT_SECRET_KEY
Запуск: python test_jwt_key.py
"""
import os
import sys

# Удаляем JWT_SECRET_KEY из окружения для теста
for k in list(os.environ.keys()):
    if 'JWT' in k:
        del os.environ[k]

# Создаём временный .env без JWT_SECRET_KEY
with open('.env.test', 'w') as f:
    f.write("ADMIN_USERNAME=admin\nADMIN_PASSWORD=admin123\nDATABASE_URL=sqlite:///test.db\n")

# Загружаем config напрямую
from dotenv import load_dotenv
load_dotenv('.env.test', override=True)

print("=" * 60)
print("ТЕСТ: Проверка валидации JWT_SECRET_KEY")
print("=" * 60)

# Проверяем что ключа нет
key = os.getenv('JWT_SECRET_KEY')
print(f"\n📋 JWT_SECRET_KEY в окружении: {'ЕСТЬ' if key else 'ОТСУТСТВУЕТ ❌'}")

if key:
    print(f"   Значение: {key[:30]}...")
    print("\n⚠️  Ключ найден! Удалите JWT_SECRET_KEY из .env.test чтобы проверить валидацию.")
else:
    print("\n🔒 Пробуем импортировать services.auth...")
    try:
        from services.auth import SECRET_KEY
        print(f"\n❌ ТЕСТ ПРОВАЛЕН: Ключ загружен — {SECRET_KEY[:30]}...")
        print("   Ожидался ValueError!")
    except ValueError as e:
        error_msg = str(e)
        print(f"\n✅ ТЕСТ ПРОЙДЕН!")
        print(f"   Получена ожидаемая ошибка: ValueError")
        print(f"   Сообщение: {error_msg[:80]}...")
    except Exception as e:
        print(f"\n⚠️  Другая ошибка: {type(e).__name__}: {e}")

# Убираем тестовый файл
if os.path.exists('.env.test'):
    os.remove('.env.test')

print("\n" + "=" * 60)
