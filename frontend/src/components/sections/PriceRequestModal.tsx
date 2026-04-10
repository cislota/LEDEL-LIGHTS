// src/components/modals/PriceRequestModal.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import PhoneInput from 'react-phone-number-input';
import { submitPriceRequest } from '@/utils/api';

interface PriceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PriceRequestModal({ isOpen, onClose }: PriceRequestModalProps) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('RU');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1 && email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Введите корректный email');
        return;
      }
      setError('');
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleSubmit = async () => {
    if (!phone || phone.length < 10) {
      setError('Введите корректный номер телефона');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await submitPriceRequest({
        email: email.trim(),
        phone: phone,
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        onClose();
        setSubmitSuccess(false);
        setStep(1);
        setEmail('');
        setPhone('');
      }, 2000);
    } catch (error) {
      console.error('Ошибка отправки запроса прайса:', error);
      setError(error instanceof Error ? error.message : 'Ошибка отправки. Попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && email) {
      handleNext();
    }
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && phone) {
      handleSubmit();
    }
  };

  const handlePhoneChange = (value: any) => {
    setPhone(value);
    if (error) setError('');
  };

  return (
    <>
      {/* Затемнение фона */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[9999]"
        onClick={onClose}
      />

      {/* Кнопка закрытия (крестик) - в правом верхнем углу страницы */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition text-white text-3xl font-bold z-[10000]"
        aria-label="Закрыть"
        style={{ border: 'none', cursor: 'pointer' }}
      >
        ✕
      </button>

      {/* Модальное окно */}
      <div 
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-8 z-[10000]"
        style={{ 
          width: '560px', 
          minHeight: '432px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h2 
            style={{ 
              fontSize: '36px',
              fontFamily: '"TildaSans", Arial, sans-serif',
              fontWeight: 'bold',
              lineHeight: 1.2,
            }}
          >
            Отправим оптовый прайс<br />вам на почту
          </h2>
        </div>

        {/* Шаг 1: Email */}
        {step === 1 && (
          <div className="flex-1 flex flex-col justify-center">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              onKeyDown={handleEmailKeyDown}
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-full focus:outline-none focus:border-red-600 transition"
              style={{ 
                fontSize: '16px',
                fontFamily: '"TildaSans", Arial, sans-serif',
              }}
            />
            
            {/* Индикатор прогресса и кнопка - текст слева, круг справа */}
            <div className="relative flex items-center justify-between mt-8">
              
              {/* Пустой блок слева для баланса */}
              <div className="w-[120px]" />

              {/* Индикатор строго по центру - текст слева, круг справа */}
              <div
                className="absolute left-1/2 transform -translate-x-1/2 flex items-center transition-all duration-700"
                style={{ transition: 'all 0.7s ease' }}
              >
                <span
                  className="text-gray-400 mr-2"
                  style={{ fontSize: '14px' }}
                >
                  1 / 2
                </span>
                {/* 🔧 Круг: левая половина серая, правая красная */}
                <svg width="20" height="20" viewBox="0 0 20 20">
                  {/* Левая половина (серая) */}
                  <path
                    d="M 10 2 A 8 8 0 0 0 10 18"
                    fill="none"
                    stroke="#d1d1d1"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  {/* Правая половина (красная) */}
                  <path
                    d="M 10 18 A 8 8 0 0 0 10 2"
                    fill="none"
                    stroke="#d5302c"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Кнопка справа */}
              <button
                onClick={handleNext}
                disabled={!email}
                className="px-8 py-3 bg-[#d5302c] text-white font-bold rounded-full hover:bg-[#b52824] transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  fontSize: '14px',
                  fontFamily: '"TildaSans", Arial, sans-serif',
                  minWidth: '120px',
                }}
              >
                ПОЛУЧИТЬ →
              </button>
            </div>
          </div>
        )}

        {/* Шаг 2: Телефон */}
        {step === 2 && (
          <div className="flex-1 flex flex-col justify-center">
            {submitSuccess ? (
              <div className="text-center">
                <div className="text-5xl mb-4">✅</div>
                <p
                  className="mb-4"
                  style={{
                    fontSize: '18px',
                    fontFamily: '"TildaSans", Arial, sans-serif',
                    color: '#22c55e',
                    fontWeight: 'bold',
                  }}
                >
                  Заявка отправлена!
                </p>
                <p
                  style={{
                    fontSize: '15px',
                    fontFamily: '"TildaSans", Arial, sans-serif',
                    color: '#666666',
                    lineHeight: 1.5,
                  }}
                >
                  Мы отправим прайс-лист на ваш email
                </p>
              </div>
            ) : (
              <>
                <p
                  className="mb-6"
                  style={{
                    fontSize: '15px',
                    fontFamily: '"TildaSans", Arial, sans-serif',
                    color: '#666666',
                    lineHeight: 1.5,
                  }}
                >
                  На случай, если письмо попадет в спам, пожалуйста,<br />
                  оставьте ваш телефон
                </p>

                {/* Форма с валидацией */}
                <div className="w-full">
                  <PhoneInput
                    international
                    defaultCountry="RU"
                    countryCallingCodeEditable={false}
                    value={phone}
                    onChange={handlePhoneChange}
                    onCountryChange={setCountry}
                    onKeyDown={handlePhoneKeyDown}
                    placeholder="+7 (000) 000-00-00"
                    className={`PhoneInputCustom w-full h-[50px] ${error ? 'error' : ''}`}
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
              </>
            )}
            
            {/* Индикатор прогресса и кнопки - текст слева, круг справа */}
            <div className="relative flex items-center justify-between mt-8">
              
              {/* Кнопка НАЗАД слева */}
              <button
                onClick={handleBack}
                className="px-8 py-3 bg-[#d5302c] text-white font-bold rounded-full hover:bg-[#b52824] transition"
                style={{
                  fontSize: '14px',
                  fontFamily: '"TildaSans", Arial, sans-serif',
                  minWidth: '120px',
                }}
              >
                ← НАЗАД
              </button>

              {/* Индикатор строго по центру - текст слева, круг справа */}
              <div
                className="absolute left-1/2 transform -translate-x-1/2 flex items-center transition-all duration-700"
                style={{ transition: 'all 0.7s ease' }}
              >
                <span
                  className="text-gray-400 mr-2"
                  style={{ fontSize: '14px' }}
                >
                  2 / 2
                </span>
                {/* 🔧 Круг: полностью красный (только обводка) */}
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    fill="none"
                    stroke="#d5302c"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              {/* Кнопка ОТПРАВИТЬ справа */}
              {!submitSuccess && (
                <button
                  onClick={handleSubmit}
                  disabled={!phone || isSubmitting}
                  className="px-8 py-3 bg-[#d5302c] text-white font-bold rounded-full hover:bg-[#b52824] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    fontSize: '14px',
                    fontFamily: '"TildaSans", Arial, sans-serif',
                    minWidth: '120px',
                  }}
                >
                  {isSubmitting ? 'Отправка...' : 'ОТПРАВИТЬ'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Футер с политикой конфиденциальности */}
        <div className="text-center mt-8">
          <p 
            style={{
              fontSize: '15px',
              fontFamily: '"TildaSans", Arial, sans-serif',
              color: '#666666',
            }}
          >
            Нажимая на кнопку, вы соглашаетесь с{' '}
            <Link 
              href="/privacy" 
              className="underline hover:text-[#d5302c] transition"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              политикой конфиденциальности
            </Link>
          </p>
        </div>
      </div>

      {/* Стили для PhoneInput */}
      <style jsx global>{`
        .PhoneInputCustom {
          border: 2px solid #e5e7eb;
          border-radius: 9999px;
          padding: 0;
          display: flex;
          align-items: stretch;
          overflow: hidden;
          height: 50px;
        }

        .PhoneInputCustom:focus-within {
          outline: none;
          border-color: #d5302c;
        }

        .PhoneInputCustom.error {
          border-color: #d5302c;
        }

        .PhoneInputCountry {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 16px;
          background-color: #f5f5f5;
          border-right: 1px solid #e5e7eb;
          min-width: 80px;
        }

        .PhoneInputCountrySelect {
          font-family: "TildaSans", Arial, sans-serif;
          border: none;
          background: transparent;
          cursor: pointer;
        }

        .PhoneInputInput {
          border: none;
          outline: none;
          width: 100%;
          font-family: "TildaSans", Arial, sans-serif;
          font-size: 16px;
          padding: 0 24px;
          height: 100%;
        }
      `}</style>
    </>
  );
}