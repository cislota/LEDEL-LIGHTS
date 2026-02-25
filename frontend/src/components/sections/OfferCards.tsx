// src/components/sections/OfferCards.tsx
'use client';

import { useState } from 'react';

export default function OfferCards() {
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Заявка отправлена:', phone);
  };

  return (
    <section className="bg-white">
      {/* Заголовок — центрирован по экрану, max-width = 1158px */}
      <div
        className="container mx-auto px-4"
        style={{ paddingTop: '45px', paddingBottom: '75px' }}
      >
        <div
          className="max-w-[1158px] mx-auto text-center"
          style={{
            fontSize: '24px',
            fontFamily: '"TildaSans", Arial, sans-serif',
            color: '#000000',
            lineHeight: 1.5,
            fontWeight: 'normal',
          }}
        >
          <strong style={{ color: '#d5302c', fontWeight: 'bold' }}>
            Поможем владельцам
          </strong>{' '}
          помещений{' '}
          <strong style={{ color: '#d5302c', fontWeight: 'bold' }}>
            сэкономить
          </strong>{' '}
          нервы, время и&nbsp;деньги. Подберем или разработаем светильник для любого назначения.
        </div>
      </div>

      {/* Карточки и форма — абсолютное позиционирование */}
      <div
        className="relative mx-auto max-w-[1440px]"
        style={{ height: '650px' }}
      >
        {/* Карточка 1 */}
        <div
          className="bg-[#f1f1f1] p-6 rounded-2xl absolute"
          style={{
            width: '359px',
            height: '302px',
            left: '167px',
            top: '30px',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
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
            Сэкономьте до{' '}
            <span style={{ color: '#d5302c', fontWeight: 'bold' }}>«40%»</span>{' '}
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
          className="bg-[#f1f1f1] p-6 rounded-2xl absolute"
          style={{
            width: '359px',
            height: '302px',
            left: '566px',
            top: '29px',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
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
            Закупайте освещение в «режиме одного окна»:
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
            <span style={{ color: '#d5302c', fontWeight: 'bold' }}>«0%»</span> переплаты.
          </p>
        </div>

        {/* Карточка 3 */}
        <div
          className="bg-[#f1f1f1] p-6 rounded-2xl absolute"
          style={{
            width: '761px',
            height: '275px',
            left: '166px',
            top: '355px',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
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
            }}
          >
            Наши специалисты правильно сформируют световое пространство, что сэкономит{' '}
            <span style={{ color: '#d5302c', fontWeight: 'bold' }}>«до 70%»</span> вашего бюджета за счет энергоэффективности.
          </p>
        </div>

        {/* Форма */}
        <div
          className="bg-white p-6 rounded-2xl absolute border-2 border-[#d5302c]"
          style={{
            width: '359px',
            height: '587px',
            left: '966px',
            top: '29px',
          }}
        >
          <h3
            style={{
              fontSize: '22px',
              fontFamily: '"TildaSans", Arial, sans-serif',
              color: '#000000',
              fontWeight: 'normal',
              lineHeight: 1.4,
              marginBottom: '24px',
              textAlign: 'center',
            }}
          >
            Оставьте заявку<br />
            на бесплатный<br />
            светотехнический расчет
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (000) 000-00-00"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                style={{
                  fontSize: '16px',
                  fontFamily: '"TildaSans", Arial, sans-serif',
                  padding: '12px 16px',
                }}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition"
              style={{
                fontSize: '16px',
                fontFamily: '"TildaSans", Arial, sans-serif',
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