// src/components/sections/ProjectSliderSection.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProjectSliderSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 7 слайдов
  const slides = [
    {
      img: '/media/slide-1.jpg.webp',
      title: 'ЗАГОЛОВОК СЛАЙДА 1',
      description: 'Описание слайда 1 — кратко и по делу.',
      infoButton: 'Информационная метка 1',
    },
    {
      img: '/media/slide-2.jpg.webp',
      title: 'ЗАГОЛОВОК СЛАЙДА 2',
      description: 'Описание слайда 2 — кратко и по делу.',
      infoButton: 'Информационная метка 2',
    },
    {
      img: '/media/slide-3.jpg.webp',
      title: 'ЗАГОЛОВОК СЛАЙДА 3',
      description: 'Описание слайда 3 — кратко и по делу.',
      infoButton: 'Информационная метка 3',
    },
    {
      img: '/media/slide-4.jpg.webp',
      title: 'ЗАГОЛОВОК СЛАЙДА 4',
      description: 'Описание слайда 4 — кратко и по делу.',
      infoButton: 'Информационная метка 4',
    },
    {
      img: '/media/slide-5.jpg.webp',
      title: 'ЗАГОЛОВОК СЛАЙДА 5',
      description: 'Описание слайда 5 — кратко и по делу.',
      infoButton: 'Информационная метка 5',
    },
    {
      img: '/media/slide-6.jpg.webp',
      title: 'ЗАГОЛОВОК СЛАЙДА 6',
      description: 'Описание слайда 6 — кратко и по делу.',
      infoButton: 'Информационная метка 6',
    },
    {
      img: '/media/slide-7.jpg.webp',
      title: 'ЗАГОЛОВОК СЛАЙДА 7',
      description: 'О слайда 7 — кратко и по делу.',
      infoButton: 'Информационная метка 7',
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlide = slides[currentIndex];

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Блок 1: Заголовок — 1492×203 */}
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
            }}
          >
            <h2
              style={{
                fontSize: '42px',
                fontFamily: '"TildaSans", Arial, sans-serif',
                fontWeight: 'normal',
                color: '#000000',
                lineHeight: 1.3,
                margin: 0,
                textAlign: 'left',
              }}
            >
              Обратитесь к нашим менеджерам с опытом поставки светильников более чем{' '}
              <strong style={{ fontWeight: 'bold' }}>на 3000 объектов</strong> по всей РФ!
            </h2>
          </div>
        </div>

        {/* Блок 2: Слайдер — 1492×424 */}
        <div
          className="relative mx-auto mt-12"
          style={{ width: '1492px', height: '424px' }}
        >
          {/* Контент — в рамках 1160px */}
          <div
            className="absolute"
            style={{
              left: '166px',
              top: '0',
              width: '1160px',
              height: '424px',
            }}
          >
            {/* Изображение — 460×288 */}
            <div
              className="absolute"
              style={{
                left: '0',
                top: '0',
                width: '460px',
                height: '288px',
              }}
            >
              <Image
                src={currentSlide.img}
                alt={currentSlide.title}
                width={460}
                height={288}
                className="w-full h-full object-cover rounded-lg"
                priority={currentIndex === 0}
              />
            </div>

            {/* Текстовый блок — справа */}
            <div
              className="absolute"
              style={{
                left: '500px',
                top: '0',
                width: '533px',
              }}
            >
              {/* Заголовок — 533×168, 32px, жирный */}
              <div
                className="mb-6"
                style={{
                  width: '533px',
                  height: '168px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <h3
                  style={{
                    fontSize: '32px',
                    fontFamily: '"TildaSans", Arial, sans-serif',
                    fontWeight: 'bold',
                    color: '#000000',
                    lineHeight: 1.3,
                    margin: 0,
                    textAlign: 'left',
                  }}
                >
                  {currentSlide.title}
                </h3>
              </div>

              {/* Описание — 533×42, 16px, нормальный */}
              <div
                style={{
                  width: '533px',
                  height: '42px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <p
                  style={{
                    fontSize: '16px',
                    fontFamily: '"TildaSans", Arial, sans-serif',
                    color: '#000000',
                    fontWeight: 'normal',
                    lineHeight: 1.5,
                    margin: 0,
                    textAlign: 'left',
                  }}
                >
                  {currentSlide.description}
                </p>
              </div>

              {/* Информативная «кнопка» — 266×57, red, unclic */}
              <div
                className="mt-6"
                style={{
                  width: '266px',
                  height: '57px',
                  backgroundColor: '#d5302c',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
 <span
                  style={{
                    fontSize: '16px',
                    fontFamily: '"TildaSans", Arial, sans-serif',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  {currentSlide.infoButton}
                </span>
              </div>
            </div>

            {/* Стрелки навигации */}
            <div
              className="absolute"
              style={{
                left: '0',
                top: '308px',
                width: '460px',
                display: 'flex',
                justifyContent: 'space-between',
                paddingLeft: '20px',
                paddingRight: '20px',
              }}
            >
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Предыдущий слайд"
                className="flex items-center justify-center"
                style={{ width: '17px', height: '32px' }}
              >
                <Image
                  src="/media/left-arrow.svg"
                  alt="←"
                  width={17}
                  height={32}
                  className="object-contain"
                />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Следующий слайд"
                className="flex items-center justify-center"
                style={{ width: '17px', height: '32px' }}
              >
                <Image
                  src="/media/right-arrow.svg"
                  alt="→"
                  width={17}
                  height={32}
                  className="object-contain"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}