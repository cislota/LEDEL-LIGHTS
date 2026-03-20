// src/components/sections/ContactManagerSection.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import PhoneInput, { 
  type Country, 
  type Value,
  isValidPhoneNumber 
} from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function ContactManagerSection() {
  //  Состояния для формы телефона
  const [phone, setPhone] = useState<any>('');
  const [country, setCountry] = useState<Country>('RU');
  const [error, setError] = useState<string>('');

  const handlePhoneChange = (value: Value) => {
    setPhone(value);
    if (error) setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
    // TODO: интеграция с бэкендом
  };

  const isPhoneValid = phone && isValidPhoneNumber(phone);
  const canSubmit = isPhoneValid && phone.length >= 10;

  return (
    <section id="contact-manager" className="bg-white py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-4">
        
        {/* Заголовок — адаптивный */}
        <div className="w-full max-w-[1492px] mx-auto">
          <h2
            className="text-center px-4"
            style={{
              fontSize: 'clamp(28px, 5vw, 42px)',
              fontFamily: '"TildaSans", Arial, sans-serif',
              fontWeight: 'bold',
              color: '#000000',
              lineHeight: 1.2,
            }}
          >
            Индивидуальное КП для Вашего проекта от наших менеджеров:
          </h2>
        </div>

        {/* Основной блок — оригинальная сетка: контент слева, фото справа */}
        <div className="w-full max-w-[1160px] mx-auto mt-8 md:mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            
            {/* Левая часть: список + форма (оригинальное расположение) */}
            <div className="order-2 lg:order-1 px-4 lg:px-0">
              
              {/* Подзаголовок */}
              <p
                className="mb-4"
                style={{
                  fontSize: 'clamp(18px, 3vw, 24px)',
                  fontFamily: '"TildaSans", Arial, sans-serif',
                  color: '#000000',
                  lineHeight: 1.5,
                  marginTop: '24px',
                }}
              >
                Обратитесь к нашим менеджерам и получите:
              </p>

              {/* Список услуг */}
              <ul className="space-y-3 md:space-y-4 mb-6">
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
                        fontSize: 'clamp(16px, 2.5vw, 20px)',
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

              {/* Форма с валидацией */}
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-6 w-full">
                
                {/* Поле ввода телефона */}
                <div className="w-full sm:w-[303px]">
                  <PhoneInput
                    international
                    defaultCountry="RU"
                    countryCallingCodeEditable={false}
                    value={phone}
                    onChange={handlePhoneChange}
                    onCountryChange={setCountry}
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

                {/* Кнопка отправки */}
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`w-full sm:w-[280px] h-[50px] text-white font-bold rounded-lg transition flex items-center justify-center flex-shrink-0 ${
                    canSubmit
                      ? 'bg-[#d5302c] hover:bg-[#b52824] cursor-pointer'
                      : 'bg-[#f5a6a6] cursor-not-allowed'
                  }`}
                  style={{
                    fontSize: '14px',
                    fontFamily: '"TildaSans", Arial, sans-serif',
                    boxShadow: canSubmit ? '0 4px 12px rgba(213, 48, 44, 0.3)' : 'none',
                  }}
                >
                  ПОЛУЧИТЬ РАСЧЕТ
                </button>
              </form>
            </div>

            {/* Правая часть: фото менеджера (оригинальное расположение) */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[400px] md:max-w-[541px] aspect-square">
                <Image
                  src="/media/Mask_group.png.webp"
                  alt="Менеджер"
                  fill
                  className="object-contain rounded-full"
                  sizes="(max-width: 1024px) 100vw, 541px"
                  priority={false}
                />
              </div>
            </div>
            
          </div>
        </div>

        {/* Нижний блок: линия + контакты */}
        <div className="w-full max-w-[1160px] mx-auto mt-12 md:mt-16 px-4">
          <div style={{ height: '1px', backgroundColor: '#d5302c' }}></div>
          
          <div className="pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
            
            {/* WhatsApp */}
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10">
                <Image
                  src="/media/question_riddle.svg"
                  alt="WhatsApp"
                  width={35}
                  height={35}
                  className="object-contain"
                />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 'clamp(14px, 2vw, 18px)',
                    fontFamily: '"TildaSans", Arial, sans-serif',
                    color: '#000000',
                    fontWeight: 'bold',
                  }}
                >
                  Обсудим проект в WhatsApp:
                </div>
                <div
                  style={{
                    fontSize: '16px',
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
              <div className="flex-shrink-0 w-10 h-10">
                <Image
                  src="/media/envelope_e-mail_mail.svg"
                  alt="Email"
                  width={35}
                  height={35}
                  className="object-contain"
                />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 'clamp(14px, 2vw, 18px)',
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
                    fontSize: '16px',
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
              <div className="flex-shrink-0 w-10 h-10">
                <Image
                  src="/media/phone_contact_call_r.svg"
                  alt="Телефон"
                  width={35}
                  height={35}
                  className="object-contain"
                />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 'clamp(14px, 2vw, 18px)',
                    fontFamily: '"TildaSans", Arial, sans-serif',
                    color: '#000000',
                    fontWeight: 'bold',
                  }}
                >
                  Позвоните нам:
                </div>
                <div
                  style={{
                    fontSize: '16px',
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