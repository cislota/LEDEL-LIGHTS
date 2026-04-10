// src/components/sections/QuizModal.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import PhoneInput, {
  type Country,
  type Value,
  isValidPhoneNumber
}
from 'react-phone-number-input';
import { submitQuizResult } from '@/utils/api';

export default function QuizModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState<any>('');
  const [country, setCountry] = useState<Country>('RU');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Проверка: прошел ли пользователь опрос ранее
  useEffect(() => {
    const hasCompletedQuiz = localStorage.getItem('quizCompleted');
    if (hasCompletedQuiz === 'true') {
      return; // Не показываем опрос
    }

    // Первый показ через 30 секунд
    const firstTimer = setTimeout(() => {
      setIsOpen(true);
    }, 30000);

    // Последующие показы каждую минуту
    const intervalTimer = setInterval(() => {
      setIsOpen(true);
    }, 60000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(intervalTimer);
    };
  }, []);

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

  const handleSingleSelect = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleMultiSelect = (questionId: number, value: string) => {
    setAnswers(prev => {
      const current = prev[questionId] as string[] || [];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [questionId]: updated };
    });
  };

  const nextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
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

    try {
      // Отправка данных на бэкенд
      await submitQuizResult({
        name: '',
        email: email.trim(),
        phone: phone?.replace(/\D/g, '') || '',
        answers: JSON.stringify(answers),
        result_type: 'quiz_result',
      });

      // localStorage.removeItem('quizCompleted') для отладки в консоли браузера
      // Помечаем опрос как пройденный
      localStorage.setItem('quizCompleted', 'true');
      setIsSubmitted(true);

      // Закрываем через 2 секунды
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      console.error('Ошибка отправки квиза:', error);
      setEmailError('Произошла ошибка при отправке. Попробуйте снова.');
    }
  };

  const isAnswered = (questionId: number) => {
    return answers[questionId] !== undefined && 
           (Array.isArray(answers[questionId]) 
             ? (answers[questionId] as string[]).length > 0 
             : (answers[questionId] as string).length > 0);
  };

  const getProgressPercent = () => {
    return ((currentStep - 1) / 6) * 100;
  };

  // Вопросы
  const questions = [
    {
      id: 1,
      question: 'Какой тип объекта вы хотите осветить?',
      type: 'radio',
      options: [
        'Жилой дом',
        'Офисное здание',
        'Магазин или склад',
        'Спортивный зал или фитнес-центр',
        'Ресторан или отель',
        'Учебное заведение',
        'Производственное предприятие',
        'Другое',
      ],
    },
    {
      id: 2,
      question: 'Какой у вас бюджет на освещение?',
      type: 'radio',
      options: [
        'до 100 тыс. руб.',
        'от 100 тыс. руб.',
        'от 500 тыс. руб.',
      ],
    },
    {
      id: 3,
      question: 'Какие факторы для вас наиболее важны при выборе светотехнического оборудования? (можно выбрать несколько вариантов)',
      type: 'checkbox',
      options: [
        'Энергоэффективность',
        'Долговечность',
        'Эстетика',
        'Быстрая доставка',
        'Гарантийное и постгарантийное обслуживание',
        'Соответствие стандартам',
      ],
    },
    {
      id: 4,
      question: 'Сталкивались ли вы ранее с какими-либо проблемами при выборе или установке освещения?',
      type: 'checkbox',
      options: [
        'Задержки в поставке',
        'Высокая стоимость',
        'Сложности в подборе подходящего оборудования',
        'Недостаточное качество продукции',
        'Отсутствие консультаций',
      ],
    },
    {
      id: 5,
      question: 'Нужна ли вам помощь в проведении светотехнического расчета?',
      type: 'radio',
      options: ['Да', 'Нет'],
    },
    {
      id: 6,
      question: 'Интересует ли вас консультация эксперта по выбору светотехнического оборудования?',
      type: 'radio',
      options: ['Да', 'Нет'],
    },
  ];

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={closeModal}
    >
      {/* Кнопка закрытия — в правом верхнем углу экрана */}
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

      {/* Окно опроса */}
      <div 
        className="relative bg-white"
        style={{ width: '560px', height: '736px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Шапка */}
        <div 
          className="px-8 pt-8 pb-4"
          style={{ backgroundColor: '#f5f5f5' }}
        >
          <div className="flex justify-between items-start mb-4">
            <div style={{ flex: 1 }}>
              <p style={{ 
                fontSize: currentStep <= 6 ? '16px' : '28px', // размер шрифта на 7 странице
                fontWeight: currentStep <= 6 ? 'normal' : 'bold', // масса шрифта на 7 странице
                fontFamily: '"TildaSans", Arial, sans-serif',
                color: '#000000',
                lineHeight: 1.5,
                margin: 0,
              }}>
                {/* Изменённый текст шапки на 7 странице */}
                {currentStep <= 6 ? (
                  <>
                    Пройдите короткий тест, <strong>чтобы подобрать оптимальное освещение + получите методичку</strong>{' '}
                    <span style={{ color: '#d5302c' }}>«Как сэкономить и увеличить свой доход при закупке светильников»</span>
                  </>
                ) : (
                  <>
                    Заполните форму
                  </>
                )}
              </p>
            </div>
            {/* Счётчик — скрывается на 7 странице */}
            {currentStep <= 6 && (
              <div style={{ 
                fontSize: '14px', 
                fontFamily: '"TildaSans", Arial, sans-serif',
                color: '#000000',
                fontWeight: 'bold',
              }}>
                {currentStep}/6
              </div>
            )}
          </div>

          {/* Progress bar — скрывается на 7 странице */}
          {currentStep <= 6 && (
            <div style={{ 
              height: '4px', 
              backgroundColor: '#e0e0e0',
              borderRadius: '2px',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${getProgressPercent()}%`,
                height: '100%',
                backgroundColor: '#d5302c',
                transition: 'width 0.3s ease',
              }} />
            </div>
          )}
        </div>

        {/* Контент */}
        <div className="px-8 py-6" style={{ height: 'calc(736px - 200px)', overflowY: 'auto' }}>
          {currentStep <= 6 ? (
            // Вопросы 1-6
            <>
              <h3 style={{
                fontSize: '24px',
                fontFamily: '"TildaSans", Arial, sans-serif',
                color: '#000000',
                fontWeight: 'normal',
                lineHeight: 1.4,
                marginBottom: '32px',
              }}>
                {questions[currentStep - 1].question}
              </h3>

              <div className="space-y-4">
                {questions[currentStep - 1].options.map((option, index) => {
                  const isSelected = questions[currentStep - 1].type === 'radio'
                    ? answers[currentStep] === option
                    : (answers[currentStep] as string[])?.includes(option);

                  return (
                    <label
                      key={index}
                      className="flex items-center cursor-pointer group"
                      style={{ 
                        padding: '6px 0',
                        borderBottom: '1px solid #f0f0f0',
                      }}
                    >
                      <div style={{ position: 'relative', marginRight: '12px' }}>
                        {questions[currentStep - 1].type === 'radio' ? (
                          <>
                            <input
                              type="radio"
                              name={`question-${currentStep}`}
                              value={option}
                              checked={isSelected}
                              onChange={() => handleSingleSelect(currentStep, option)}
                              className="sr-only"
                            />
                            <div style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              border: `2px solid ${isSelected ? '#d5302c' : '#e0e0e0'}`,
                              backgroundColor: isSelected ? '#d5302c' : '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s',
                            }}>
                              {isSelected && (
                                <div style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  backgroundColor: '#ffffff',
                                }} />
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <input
                              type="checkbox"
                              value={option}
                              checked={isSelected}
                              onChange={() => handleMultiSelect(currentStep, option)}
                              className="sr-only"
                            />
                            <div style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '4px',
                              border: `2px solid ${isSelected ? '#d5302c' : '#e0e0e0'}`,
                              backgroundColor: isSelected ? '#d5302c' : '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s',
                            }}>
                              {isSelected && (
                                <span style={{ color: '#ffffff', fontSize: '16px', fontWeight: 'bold' }}>✓</span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                      <span style={{
                        fontSize: '16px',
                        fontFamily: '"TildaSans", Arial, sans-serif',
                        color: '#000000',
                      }}>
                        {option}
                      </span>
                    </label>
                  );
                })}
              </div>
            </>
          ) : (
            // Финальная форма (шаг 7)
            <div>
              {/* Изменённый текст вопроса на 7 странице */}
              <h3 style={{
                fontSize: '20px',
                fontFamily: '"TildaSans", Arial, sans-serif',
                color: '#000000',
                fontWeight: 'normal',
                lineHeight: 1.4,
                marginBottom: '32px',
              }}>
                Чтобы мы могли направить вам персональное предложение на основе полученной информации и отправить методичку "Как сэкономить и увеличить свой доход при закупке светильников"
              </h3>

              <div className="space-y-6">
                {/* Email */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontFamily: '"TildaSans", Arial, sans-serif',
                    color: '#000000',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                  }}>
                    Email:
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    style={{
                      fontFamily: '"TildaSans", Arial, sans-serif',
                      fontSize: '16px',
                      borderColor: emailError ? '#d5302c' : '#e0e0e0',
                    }}
                  />
                  {emailError && (
                    <p style={{ color: '#d5302c', fontSize: '14px', marginTop: '4px' }}>{emailError}</p>
                  )}
                </div>

                {/* Телефон */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontFamily: '"TildaSans", Arial, sans-serif',
                    color: '#000000',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                  }}>
                    Номер телефона:
                  </label>
                  <PhoneInput
                    international
                    defaultCountry="RU"
                    countryCallingCodeEditable={false}
                    value={phone}
                    onChange={setPhone}
                    onCountryChange={setCountry}
                    placeholder="+7 (000) 000-00-00"
                    className={`PhoneInputCustom w-full ${phoneError ? 'error' : ''}`}
                  />
                  {phoneError && (
                    <p style={{ color: '#d5302c', fontSize: '14px', marginTop: '4px' }}>{phoneError}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Кнопки навигации */}
        <div className="px-8 pb-8" style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <div className="flex justify-between items-center">
            {/* Кнопка Назад */}
            {currentStep > 1 ? (
              <button
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-3 rounded-lg transition hover:opacity-80"
                style={{
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: '"TildaSans", Arial, sans-serif',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
              >
                ← Назад
              </button>
            ) : (
              <div /> // Пустой div для сохранения структуры
            )}

            {/* Кнопка Вперед / Отправить */}
            {currentStep < 6 ? (
              <button
                onClick={nextStep}
                disabled={!isAnswered(currentStep)}
                className="px-8 py-3 rounded-lg transition"
                style={{
                  backgroundColor: isAnswered(currentStep) ? '#d5302c' : 'transparent',
                  color: isAnswered(currentStep) ? '#ffffff' : '#d5302c',
                  border: `2px solid #d5302c`,
                  cursor: isAnswered(currentStep) ? 'pointer' : 'not-allowed',
                  fontFamily: '"TildaSans", Arial, sans-serif',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  opacity: isAnswered(currentStep) ? 1 : 0.5,
                }}
              >
                Далее →
              </button>
            ) : currentStep === 6 ? (
              <button
                onClick={nextStep}
                disabled={!isAnswered(currentStep)}
                className="px-8 py-3 rounded-lg transition"
                style={{
                  backgroundColor: isAnswered(currentStep) ? '#d5302c' : 'transparent',
                  color: isAnswered(currentStep) ? '#ffffff' : '#d5302c',
                  border: `2px solid #d5302c`,
                  cursor: isAnswered(currentStep) ? 'pointer' : 'not-allowed',
                  fontFamily: '"TildaSans", Arial, sans-serif',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  opacity: isAnswered(currentStep) ? 1 : 0.5,
                }}
              >
                Последний вопрос
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!email || !phone}
                className="px-8 py-3 rounded-lg transition"
                style={{
                  backgroundColor: (email && phone && isValidPhoneNumber(phone)) ? '#d5302c' : 'transparent',
                  color: (email && phone && isValidPhoneNumber(phone)) ? '#ffffff' : '#d5302c',
                  border: `2px solid #d5302c`,
                  cursor: (email && phone && isValidPhoneNumber(phone)) ? 'pointer' : 'not-allowed',
                  fontFamily: '"TildaSans", Arial, sans-serif',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  opacity: (email && phone && isValidPhoneNumber(phone)) ? 1 : 0.5,
                }}
              >
                Получить результаты
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}