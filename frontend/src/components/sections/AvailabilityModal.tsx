// src/components/sections/AvailabilityModal.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PhoneInput, {
  type Country,
  type Value,
  isValidPhoneNumber
} from 'react-phone-number-input';
import { submitAvailabilityRequest } from '@/utils/api';

interface AvailabilityModalProps {
  catalogRef?: React.RefObject<HTMLElement>;
  finalCTARef?: React.RefObject<HTMLElement>;
}

export default function AvailabilityModal({ catalogRef, finalCTARef }: AvailabilityModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState<any>('');
  const [country, setCountry] = useState<Country>('RU');
  const [lampName, setLampName] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [lampNameError, setLampNameError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  //  Раздельные флаги показа для каждой секции
  const [shownInCatalog, setShownInCatalog] = useState(false);
  const [shownInFinalCTA, setShownInFinalCTA] = useState(false);

  // Инициализация флагов из localStorage
  useEffect(() => {
    const hasFilledForm = localStorage.getItem('availabilityFormFilled');
    if (hasFilledForm === 'true') {
      setIsSubmitted(true); // Не показываем вообще, если форма уже заполнена
      return;
    }
    
    // Загружаем состояние показа для каждой секции
    const catalogShown = localStorage.getItem('availabilityModalShownCatalog') === 'true';
    const finalCTAShown = localStorage.getItem('availabilityModalShownFinalCTA') === 'true';
    
    setShownInCatalog(catalogShown);
    setShownInFinalCTA(finalCTAShown);
  }, []);

  // Отслеживание скролла до секций
  useEffect(() => {
    // Если форма уже заполнена — не показываем вообще
    if (isSubmitted) {
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.5;
      
      //  Проверка CatalogSection
      if (catalogRef?.current && !isOpen && !shownInCatalog) {
        const catalogRect = catalogRef.current.getBoundingClientRect();
        const catalogTop = window.scrollY + catalogRect.top;
        
        if (scrollPosition >= catalogTop) {
          setIsOpen(true);
          setShownInCatalog(true);
          localStorage.setItem('availabilityModalShownCatalog', 'true'); //  Сохраняем в localStorage
          return;
        }
      }
      
      //  Проверка FinalCTASection (независимо от CatalogSection)
      if (finalCTARef?.current && !isOpen && !shownInFinalCTA) {
        const finalCTARect = finalCTARef.current.getBoundingClientRect();
        const finalCTATop = window.scrollY + finalCTARect.top;
        
        if (scrollPosition >= finalCTATop) {
          setIsOpen(true);
          setShownInFinalCTA(true);
          localStorage.setItem('availabilityModalShownFinalCTA', 'true'); //  Сохраняем в localStorage
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [catalogRef, finalCTARef, isOpen, isSubmitted, shownInCatalog, shownInFinalCTA]);

  // Закрытие по ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleSubmit = async () => {
    // Валидация email
    if (!email || !email.includes('@')) {
      setEmailError('Введите корректный email');
      return;
    }
    setEmailError('');

    // Валидация телефона
    if (!phone || !isValidPhoneNumber(phone)) {
      setPhoneError('Введите корректный номер телефона');
      return;
    }
    setPhoneError('');

    // Валидация наименования светильника
    if (!lampName || lampName.trim().length === 0) {
      setLampNameError('Введите наименование светильника');
      return;
    }
    setLampNameError('');

    try {
      // Отправка данных на бэкенд
      await submitAvailabilityRequest({
        email: email.trim(),
        phone: phone,
        lamp_name: lampName.trim(),
      });

      //  Помечаем форму как заполненную и очищаем флаги секций
      localStorage.setItem('availabilityFormFilled', 'true');
      localStorage.removeItem('availabilityModalShownCatalog');
      localStorage.removeItem('availabilityModalShownFinalCTA');

      setIsSubmitted(true);

      // Закрываем через 2 секунды
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      console.error('Ошибка отправки запроса наличия:', error);
      setEmailError('Произошла ошибка при отправке. Попробуйте снова.');
    }
  };

  // Функция для принудительного показа (для отладки)
  const forceShowModal = () => {
    localStorage.removeItem('availabilityFormFilled');
    localStorage.removeItem('availabilityModalShownCatalog');
    localStorage.removeItem('availabilityModalShownFinalCTA');
    setShownInCatalog(false);
    setShownInFinalCTA(false);
    setIsSubmitted(false);
    setIsOpen(true);
  };

  // Делаем функцию доступной глобально для отладки
  useEffect(() => {
    (window as any).showAvailabilityModal = forceShowModal;
    return () => {
      delete (window as any).showAvailabilityModal;
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={closeModal}
    >
      {/* Кнопка закрытия */}
      <button
        onClick={closeModal}
        className="fixed top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition z-50"
        aria-label="Закрыть"
        style={{ 
          border: 'none', 
          cursor: 'pointer', 
          fontSize: '24px',
          color: '#ffffff',
        }}
      >
        ✕
      </button>

      {/* Окно модального запроса */}
      <div 
        className="relative bg-white"
        style={{ 
          width: '848px', 
          height: '512px',
          border: '3px solid #d5302c',
          borderRadius: '20px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full">
          {/* Левая часть: форма */}
          <div className="flex-1 px-8 py-8 flex flex-col justify-center">
            {/* Заголовок */}
            <h2 style={{
              fontSize: '28px',
              fontFamily: '"TildaSans", Arial, sans-serif',
              fontWeight: 'bold',
              color: '#000000',
              lineHeight: 1.3,
              marginBottom: '32px',
            }}>
              Узнайте, есть ли в наличии<br />
              <span style={{ textTransform: 'uppercase' }}>нужный вам светильник</span>
            </h2>

            {/* Поля формы */}
            <div className="space-y-4">
              {/* Email */}
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ваш email"
                  className="w-full px-6 py-4 border-2 rounded-full focus:outline-none focus:border-red-600 transition"
                  style={{
                    fontFamily: '"TildaSans", Arial, sans-serif',
                    fontSize: '16px',
                    borderColor: emailError ? '#d5302c' : '#cccccc',
                  }}
                />
                {emailError && (
                  <p style={{ color: '#d5302c', fontSize: '14px', marginTop: '4px', marginLeft: '8px' }}>
                    {emailError}
                  </p>
                )}
              </div>

              {/* Телефон */}
              <div>
                <PhoneInput
                  international
                  defaultCountry="RU"
                  countryCallingCodeEditable={false}
                  value={phone}
                  onChange={setPhone}
                  onCountryChange={setCountry}
                  placeholder="+7 (000) 000-00-00"
                  className={`PhoneInputCustom w-full ${phoneError ? 'error' : ''}`}
                  inputProps={{
                    style: {
                      fontFamily: '"TildaSans", Arial, sans-serif',
                      fontSize: '16px',
                    }
                  }}
                />
                {phoneError && (
                  <p style={{ color: '#d5302c', fontSize: '14px', marginTop: '4px', marginLeft: '8px' }}>
                    {phoneError}
                  </p>
                )}
              </div>

              {/* Наименование светильника */}
              <div>
                <input
                  type="text"
                  value={lampName}
                  onChange={(e) => setLampName(e.target.value)}
                  placeholder="Название светильника"
                  className="w-full px-6 py-4 border-2 rounded-full focus:outline-none focus:border-red-600 transition"
                  style={{
                    fontFamily: '"TildaSans", Arial, sans-serif',
                    fontSize: '16px',
                    borderColor: lampNameError ? '#d5302c' : '#cccccc',
                  }}
                />
                {lampNameError && (
                  <p style={{ color: '#d5302c', fontSize: '14px', marginTop: '4px', marginLeft: '8px' }}>
                    {lampNameError}
                  </p>
                )}
              </div>

              {/* Кнопка */}
              <button
                onClick={handleSubmit}
                className="mt-6 px-8 py-4 rounded-full font-bold transition hover:opacity-90"
                style={{
                  backgroundColor: '#d5302c',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: '"TildaSans", Arial, sans-serif',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                }}
              >
                УЗНАТЬ НАЛИЧИЕ
              </button>

              {/* Текст о согласии */}
              <p style={{
                fontSize: '12px',
                fontFamily: '"TildaSans", Arial, sans-serif',
                color: '#666666',
                lineHeight: 1.5,
                marginTop: '16px',
              }}>
                Нажимая на кнопку "УЗНАТЬ НАЛИЧИЕ", Вы соглашаетесь с{' '}
                <Link 
                  href="/privacy"
                  style={{
                    color: '#666666',
                    textDecoration: 'underline',
                  }}
                >
                  политикой конфиденциальности
                </Link>
              </p>
            </div>
          </div>

          {/* Правая часть: изображение */}
          <div 
            className="flex items-center justify-center pr-8"
            style={{ width: '204px' }}
          >
            <Image
              src="/media/yr0kfgvx1rlmda1ge11r.jpg"
              alt="Светильник"
              width={204}
              height={414}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}