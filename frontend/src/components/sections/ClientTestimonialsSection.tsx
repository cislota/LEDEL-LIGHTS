// src/components/sections/ClientTestimonialsSection.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ClientTestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      title: '«Заголовок»',
      text: 'Описание',
      signature: 'ФИО',
      docImg: '/media/-.jpg',
      badge: 'Инф кнопка',
    },
    {
      title: '«Заголовок»',
      text: 'Описание',
      signature: 'ФИО',
      docImg: '/media/-.jpg',
      badge: 'Инф кнопка',
    },
    {
      title: '«Заголовок»',
      text: 'Описание',
      signature: 'ФИО',
      docImg: '/media/-.jpg',
      badge: 'Инф кнопка',
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        {/* Заголовок */}
        <h2
          className="text-center mb-12"
          style={{
            fontSize: '36px',
            fontFamily: '"TildaSans", Arial, sans-serif',
            fontWeight: 'bold',
            color: '#000000',
            lineHeight: 1.3,
          }}
        >
          Что о нас говорят клиенты?
        </h2>

        {/* Белый контейнер */}
        <div
          className="bg-white rounded-2xl shadow-lg mx-auto max-w-[1200px] overflow-hidden"
          style={{ padding: '40px' }}
        >
          {/* Слайд */}
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Левая часть: текст и подпись */}
            <div className="flex-1 min-w-0">
              {/* Бейдж */}
              <div
                className="inline-block mb-6 px-6 py-2 bg-red-600 text-white font-bold rounded-full text-sm"
                style={{ letterSpacing: '0.5px' }}
              >
                {current.badge}
              </div>

              {/* Заголовок отзыва */}
              <h3
                className="mb-4"
                style={{
                  fontSize: '28px',
                  fontFamily: '"TildaSans", Arial, sans-serif',
                  fontWeight: 'bold',
                  color: '#000000',
                  lineHeight: 1.4,
                }}
              >
                {current.title}
              </h3>

              {/* Текст отзыва */}
              <p
                className="mb-6 text-lg"
                style={{
                  fontFamily: '"TildaSans", Arial, sans-serif',
                  color: '#000000',
                  lineHeight: 1.6,
                }}
              >
                {current.text}
              </p>

              {/* Подпись */}
              <div
                className="px-6 py-3 bg-gray-200 rounded-lg inline-block"
                style={{
                  fontSize: '16px',
                  fontFamily: '"TildaSans", Arial, sans-serif',
                  color: '#000000',
                  fontWeight: 'normal',
                }}
              >
                {current.signature}
              </div>
            </div>

            {/* Правая часть: изображение документа */}
            <div className="flex-shrink-0 w-full lg:w-[400px]">
              <Image
                src={current.docImg}
                alt="Благодарственное письмо"
                width={400}
                height={300}
                className="w-full h-auto object-cover rounded-lg shadow-md"
                priority={currentIndex === 0}
              />
            </div>
          </div>

          {/* Стрелки навигации */}
          <div
            className="mt-8 flex justify-center gap-4"
            style={{ maxWidth: '1200px', margin: '0 auto' }}
          >
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Предыдущий отзыв"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition"
            >
              <Image
                src="/media/Group_9.svg"
                alt="←"
                width={17}
                height={32}
                className="object-contain"
              />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Следующий отзыв"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition"
            >
              <Image
                src="/media/Group_9.svg"
                alt="→"
                width={17}
                height={32}
                className="object-contain"
                style={{ transform: 'scaleX(-1)' }}
                
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}