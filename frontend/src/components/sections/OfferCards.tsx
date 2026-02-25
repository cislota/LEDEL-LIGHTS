// src/components/sections/OfferCards.tsx
'use client';

import { useState } from 'react';

export default function OfferCards() {
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Заявка отправлена:', phone);
    // TODO: интеграция с FastAPI
  };

  return (
    <section className="bg-white">
      {/* Заголовок */}
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
            <span style={{ color: '#d5302c', fontWeight: 'bold' }}>до 70%</span> вашего бюджета за счет энергоэффективности.
          </p>
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