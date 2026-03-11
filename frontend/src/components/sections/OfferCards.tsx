// src/components/sections/OfferCards.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function OfferCards() {
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Заявка отправлена:', phone);
    // TODO: интеграция с FastAPI
  };

  return (
    <section className="bg-white">

      {/* Карточки */}
      <div
        className="relative mx-auto max-w-[1440px]"
        style={{ height: '650px' }}
      >
        {/* Карточка 1 */}
        <div
          className="bg-[#f1f1f1] p-6 absolute"
          style={{
            width: '359px',
            height: '302px',
            left: '167px',
            top: '30px',
            borderRadius: '50px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            paddingTop: '55px',
            paddingLeft: '40px',
            boxSizing: 'border-box',
          }}
        >
          <h3
            style={{
              fontSize: '22px',
              fontFamily: '"TildaSans", Arial, sans-serif',
              color: '#000000',
              fontWeight: 'bold',
              lineHeight: 1.4,
              margin: '0 0 12px 0',
            }}
          >
            Сэкономьте {' '}
            <span style={{ color: '#d5302c', fontWeight: 'bold' }}>до 40%</span>{' '}
            от стоимости светильников в проекте:
          </h3>
          <p
            style={{
              fontSize: '20px',
              fontFamily: '"TildaSans", Arial, sans-serif',
              color: '#000000',
              fontWeight: 'normal',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            Мы уложимся в бюджет и поможем вам заработать на разнице цен.
          </p>
        </div>

        {/* Карточка 2 */}
        <div
          className="bg-[#f1f1f1] p-6 absolute"
          style={{
            width: '359px',
            height: '302px',
            left: '566px',
            top: '29px',
            borderRadius: '50px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            paddingTop: '55px',
            paddingLeft: '40px',
            boxSizing: 'border-box',
          }}
        >
          <h3
            style={{
              fontSize: '22px',
              fontFamily: '"TildaSans", Arial, sans-serif',
              color: '#000000',
              fontWeight: 'bold',
              lineHeight: 1.4,
              margin: '0 0 12px 0',
            }}
          >
            Закупайте освещение в&nbsp; «режиме одного окна»:
          </h3>
          <p
            style={{
              fontSize: '20px',
              fontFamily: '"TildaSans", Arial, sans-serif',
              color: '#000000',
              fontWeight: 'normal',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            Обеспечим все необходимое для вашего проекта без лишних расходов и переплат. Гарантируем{' '}
            <span style={{ color: '#d5302c', fontWeight: 'bold' }}>0%</span> переплаты.
          </p>
        </div>

        {/* Карточка 3 */}
        <div
          className="bg-[#f1f1f1] p-6 absolute"
          style={{
            width: '761px',
            height: '275px',
            left: '166px',
            top: '355px',
            borderRadius: '50px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            paddingTop: '30px',
            paddingLeft: '40px',
            paddingRight: '65px',  // отступ справа для изображения
            boxSizing: 'border-box',
          }}
        >
          {/* Текстовый блок */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', height: '100%' }}>
            <div style={{ flex: '1' }}>
              <h3
                style={{
                  fontSize: '22px',
                  fontFamily: '"TildaSans", Arial, sans-serif',
                  color: '#000000',
                  fontWeight: 'bold',
                  lineHeight: 1.4,
                  margin: '0 0 12px 0',
                  width: '320px',
                  height: '62px',
                }}
              >
                Бесплатная оптимизация светового пространства:
              </h3>
              <p
                style={{
                  fontSize: '20px',
                  fontFamily: '"TildaSans", Arial, sans-serif',
                  color: '#000000',
                  fontWeight: 'normal',
                  lineHeight: 1.5,
                  margin: 0,
                  width: '351px',
                  height: '124px',
                }}
              >
                Наши специалисты правильно сформируют световое пространство, что сэкономит{' '}
                <span style={{ color: '#d5302c', fontWeight: 'bold' }}>до 70%</span> вашего бюджета за счет энергоэффективности.
              </p>
            </div>

            {/* Изображение 255×204 */}
            <div style={{ 
              width: '255px', 
              height: '204px', 
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              flexShrink: 0,
            }}>
              <Image
                src="/media/noroot.png.webp"
                alt="Оптимизация светового пространства"
                fill
                sizes="255px"
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Форма — упрощённая*/}
        <div
          className="bg-white absolute border-2 border-[#d5302c]"
          style={{
            width: '359px',
            height: '587px',
            left: '966px',
            top: '29px',
            borderRadius: '50px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0 24px',
          }}
        >
          <h3
            style={{
              fontSize: '22px',
              fontFamily: '"TildaSans", Arial, sans-serif',
              color: '#000000',
              fontWeight: 'normal',
              lineHeight: 1.4,
              textAlign: 'center',
              marginBottom: '24px',
            }}
          >
            Оставьте заявку<br />
            <strong style={{ fontWeight: 'bold' }}>на бесплатный</strong><br />
            светотехнический расчет
          </h3>

          <form onSubmit={handleSubmit} className="w-full" style={{ maxWidth: '280px' }}>
            {/* Поле телефона и +7 */}
            <div className="mb-5 w-full">
              <div
                className="flex items-center border border-gray-300 rounded-lg overflow-hidden"
                style={{ borderColor: '#000000' }}
              >
                {/* Флаг и +7 */}
                <div
                  className="flex items-center justify-center w-12 h-10 bg-gray-50"
                  style={{ backgroundColor: '#f8f9fa', borderRight: '1px solid #cccccc' }}
                >
                  <span className="text-xs font-medium">🇷🇺</span>
                </div>
                {/* Ввод номера */}
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

            <button
              type="submit"
              className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition"
              style={{
                fontSize: '16px',
                fontFamily: '"TildaSans", Arial, sans-serif',
                borderRadius: '10px',
              }}
            >
              ПОЛУЧИТЬ РАСЧЕТ
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}