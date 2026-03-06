// src/components/sections/ContactManagerSection.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ContactManagerSection() {
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Заявка отправлена:', phone);
  };

  return (
    <section id="contact-manager" className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Заголовок — контейнер 1492×203 */}
        <div
          className="relative mx-auto"
          style={{ width: '1492px', height: '203px' }}
        >
          <div
            className="absolute"
            style={{
              left: '166px',
              top: '53px',
              width: '1160px',
              height: '98px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <h2
              style={{
                fontSize: '42px',
                fontFamily: '"TildaSans", Arial, sans-serif',
                fontWeight: 'bold',
                color: '#000000',
                lineHeight: 1.2,
                margin: 0,
                textAlign: 'center',
              }}
            >
              Индивидуальное КП для Вашего проекта от наших менеджеров:
            </h2>
          </div>
        </div>

        {/* Основной блок — ширина 1160px */}
        <div
          className="relative mx-auto mt-12"
          style={{ width: '1160px', height: '570px' }}
        >
          {/* Фото менеджера */}
          <div
            className="absolute"
            style={{
              right: '0',
              top: '20px',
              width: '541px',
              height: '529px',
            }}
          >
            <Image
              src="/media/Mask_group.png.webp"
              alt="Менеджер"
              width={541}
              height={529}
              className="w-full h-full object-cover rounded-full"
              priority
            />
          </div>

          {/* Список + форма */}
          <div
            className="absolute"
            style={{
              left: '0',
              top: '0',
              width: '600px',
              height: '570px',
              padding: '40px',
              boxSizing: 'border-box',
            }}
          >
            {/* Подзаголовок — слева, отступ сверху 24px */}
            <p
              style={{
                fontSize: '20px',
                fontFamily: '"TildaSans", Arial, sans-serif',
                color: '#000000',
                fontWeight: 'normal',
                lineHeight: 1.5,
                margin: '24px 0 16px 0',
                textAlign: 'left',
              }}
            >
              Обратитесь к нашим менеджерам и получите:
            </p>

            {/* Список услуг */}
            <ul className="space-y-4">
              {[
                'подберем светильники по ТЗ',
                'подберем аналоги',
                'предложим оптимизацию проекта',
                'подготовим коммерческое предложение с максимально возможной скидкой',
                'поможем согласовать замены с заказчиком: отправим образцы, предоставим реальные фото',
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <span
                    className="flex-shrink-0 mt-2"
                    style={{
                      width: '12px',
                      height: '2px',
                      backgroundColor: '#d5302c',
                      marginRight: '12px',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '16px',
                      fontFamily: '"TildaSans", Arial, sans-serif',
                      color: '#000000',
                      lineHeight: 1.5,
                    }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {/* Форма и кнопка */}
            <div className="flex items-center" style={{ gap: '20px', marginTop: '24px' }}>
              {/* Форма номера телефона */}
              <div className="w-[303px]">
                <div
                  className="flex items-center border rounded-lg overflow-hidden"
                  style={{ borderColor: '#000000', height: '50px' }}
                >
                  <div
                    className="flex items-center justify-center w-12 h-full bg-gray-50"
                    style={{ backgroundColor: '#f8f9fa', borderRight: '1px solid #cccccc' }}
                  >
                    <span className="text-xs font-medium">🇷🇺</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 (000) 000-00-00"
                    className="w-full px-4 py-3 border-none outline-none"
                    style={{
                      fontSize: '16px',
                      fontFamily: '"TildaSans", Arial, sans-serif',
                      color: '#000000',
                      padding: '12px 16px',
                    }}
                  />
                </div>
              </div>

              {/* Кнопка */}
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-[280px] h-[50px] bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition flex items-center justify-center"
                style={{
                  fontSize: '16px',
                  fontFamily: '"TildaSans", Arial, sans-serif',
                  textAlign: 'center',
                  lineHeight: '50px',
                }}
              >
                ПОЛУЧИТЬ РАСЧЕТ
              </button>
            </div>
          </div>
        </div>

        {/* Нижний блок: линия + контакты - ширина 1160 */}
        <div className="mt-16" style={{ width: '1160px', margin: '0 auto' }}>
          <div style={{ height: '1px', backgroundColor: '#d5302c' }}></div>
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-8">
            {/* WhatsApp */}
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6">
                <Image
                  src="/media/question_riddle.svg"
                  alt="WhatsApp"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <div>
                <div
                  style={{
                    fontSize: '16px',
                    fontFamily: '"TildaSans", Arial, sans-serif',
                    color: '#000000',
                    fontWeight: 'bold',
                  }}
                >
                  Обсудим проект в WhatsApp:
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    fontFamily: '"TildaSans", Arial, sans-serif',
                    color: '#666666',
                    marginTop: '4px',
                  }}
                >
                  отвечаем в течение 5 минут
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6">
                <Image
                  src="/media/envelope_e-mail_mail.svg"
                  alt="Email"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <div>
                <div
                  style={{
                    fontSize: '16px',
                    fontFamily: '"TildaSans", Arial, sans-serif',
                    color: '#000000',
                    fontWeight: 'bold',
                  }}
                >
                  Задайте вопрос на эл. почту:
                </div>
                <a
                  href="mailto:info@ledl-lights.ru"
                  className="block mt-1 text-red-600 hover:text-red-700"
                  style={{
                    fontSize: '14px',
                    fontFamily: '"TildaSans", Arial, sans-serif',
                    color: '#d5302c',
                  }}
                >
                  info@ledl-lights.ru
                </a>
              </div>
            </div>

            {/* Телефон */}
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6">
                <Image
                  src="/media/phone_contact_call_r.svg"
                  alt="Телефон"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <div>
                <div
                  style={{
                    fontSize: '16px',
                    fontFamily: '"TildaSans", Arial, sans-serif',
                    color: '#000000',
                    fontWeight: 'bold',
                  }}
                >
                  Позвоните нам:
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    fontFamily: '"TildaSans", Arial, sans-serif',
                    color: '#d5302c',
                    marginTop: '4px',
                  }}
                >
                  8 (800) 351-09-75
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}