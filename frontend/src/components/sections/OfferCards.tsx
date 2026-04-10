// src/components/sections/OfferCards.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import PhoneInput, {
  type Country,
  type Value,
  isValidPhoneNumber
} from 'react-phone-number-input';

export default function OfferCards() {
  const [phone, setPhone] = useState<any>('');
  const [country, setCountry] = useState<Country>('RU');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация перед отправкой
    if (!phone || !isValidPhoneNumber(phone)) {
      setError('Введите корректный номер телефона');
      return;
    }
    
    setError('');
    console.log('Заявка отправлена:', { 
      phone, 
      country,
      digits: phone?.replace(/\D/g, '') 
    });
    
    // TODO: интеграция с FastAPI
    // fetch('/api/lead', { 
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ phone: phone?.replace(/\D/g, ''), country })
    // })
  };

  const handlePhoneChange = (value: Value) => {
    setPhone(value);
    // Сбрасываем ошибку при вводе
    if (error) setError('');
  };

  // Проверка: номер валиден и достаточной длины
  const isPhoneValid = phone && isValidPhoneNumber(phone);
  const canSubmit = isPhoneValid && phone.length >= 10;

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
            paddingTop: '30px',
            paddingLeft: '40px',
            paddingRight: '65px',
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

        {/* Форма с валидацией */}
        <div
          className="bg-white absolute"
          style={{
            width: '359px',
            height: '587px',
            left: '966px',
            top: '29px',
            borderRadius: '50px',
            border: '2px solid #d5302c',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px 30px',
            boxSizing: 'border-box',
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
              marginBottom: '40px',
            }}
          >
            Оставьте заявку<br />
            <strong style={{ fontWeight: 'bold' }}>на бесплатный</strong><br />
            светотехнический расчет
          </h3>

          <form onSubmit={handleSubmit} className="w-full" style={{ maxWidth: '280px' }}>
            <div className="mb-4 w-full">
              <PhoneInput
                international
                defaultCountry="RU"
                countryCallingCodeEditable={false}
                value={phone}
                onChange={handlePhoneChange}
                onCountryChange={setCountry}
                className={`PhoneInputCustom ${error ? 'error' : ''}`}
              />
              
              {/* Сообщение об ошибке */}
              {error && (
                <p 
                  className="mt-2 text-sm"
                  style={{ 
                    color: '#d5302c', 
                    fontFamily: '"TildaSans", Arial, sans-serif',
                    textAlign: 'left',
                    minHeight: '20px'
                  }}
                >
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className={`w-full text-white font-bold py-4 rounded-xl transition-all ${
                canSubmit
                  ? 'bg-[#d5302c] hover:bg-[#b52824] cursor-pointer'
                  : 'bg-[#f5a6a6] cursor-not-allowed'
              }`}
              style={{
                fontSize: '16px',
                fontFamily: '"TildaSans", Arial, sans-serif',
                boxShadow: canSubmit ? '0 4px 12px rgba(213, 48, 44, 0.3)' : 'none',
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