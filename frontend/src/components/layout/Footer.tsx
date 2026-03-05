// src/components/sections/Footer.tsx
'use client';

import Image from 'next/image';

export default function Footer() {
  return (
    <footer
      className="bg-gray-100 py-8"
      style={{ backgroundColor: '#eeeeee' }}
    >
      <div className="container mx-auto px-4">
        {/* Верхняя часть: логотип + контакты */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6-8">
          {/* Логотип — SVG */}
          <div>
            <Image
              src="/media/logo.svg"
              alt="LEDEL"
              width={100}
              height={32}
              className="object-contain"
              priority
            />
          </div>

          {/* Контакты */}
          <div className="flex flex-col sm:flex-row gap-6-center sm:text-right">
            <div>
              <p
                style={{
                  fontSize: '16px',
                  fontFamily: '"TildaSans", Arial, sans-serif',
                  color: '#333333',
                  margin: 0,
                }}
              >
                8 (800) 351-09-75
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: '16px',
                  fontFamily: '"TildaSans", Arial, sans-serif',
                  color: '#333333',
                  margin: 0,
                }}
              >
                г. Санкт-Петербург<br />
                ул. Дибуновская, д.45
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: '16px',
                  fontFamily: '"TildaSans", Arial, sans-serif',
                  color: '#333333',
                  margin: 0,
                }}
              >
                Рабочее время:<br />
                9:00 – 18:00 (пн–пт)
              </p>
            </div>
          </div>
        </div>

        {/* Разделительная линия */}
        <div
          className="w-full border-t border-gray-300 mb-6"
          style={{ borderColor: '#cccccc' }}
        />

        {/* Нижняя строка */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm">
          <div
            style={{
              fontSize: '14px',
              fontFamily: '"TildaSans", Arial, sans-serif',
              color: '#666666',
            }}
          >
            Сделано в RE:SPOND
          </div>
          <div
            style={{
              fontSize: '14px',
              fontFamily: '"TildaSans", Arial, sans-serif',
              color: '#666666',
            }}
          >
            <a href="/privacy" className="hover:underline">
              Политика конфиденциальности
            </a>
          </div>
          <div
            style={{
              fontSize: '14px',
              fontFamily: '"TildaSans", Arial, sans-serif',
              color: '#666666',
            }}
          >
            © 2024 СветКонсалт
          </div>
        </div>
      </div>

      {/* Кнопка "Вверх" */}
      <button
        type="button"
        aria-label="Наверх"
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition"
        style={{ border: '1px solid #cccccc' }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <span
          className="text-red-600 font-bold text-xl"
          style={{ transform: 'rotate(180deg)' }}
        >
          ↑
        </span>
      </button>
    </footer>
  );
}