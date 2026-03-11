// src/components/sections/TargetAudience.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

const cards = [
  {
    img: '/media/business.jpg',
    title: 'Владельцам бизнеса',
    description: [
      { text: 'Поможем владельцам', color: '#d5302c', bold: true },
      { text: ' помещений ', color: '#000000', bold: false },
      { text: 'сэкономить', color: '#d5302c', bold: true },
      { text: ' нервы, время и\u00A0деньги. Подберем или разработаем светильник для любого назначения.', color: '#000000', bold: false },
    ],
  },
  {
    img: '/media/opt.jpg',
    title: 'Специалистам по оптовым закупкам',
    description: [
      { text: 'Зарабатывайте от\u00A0100\u00A0тыс. рублей', color: '#d5302c', bold: true },
      { text: ' на\u00A0поставках современных светильников европейского качества с\u00A0сроком службы до\u00A010 лет от\u00A0надежного российского производителя по\u00A0оптовым ценам.', color: '#000000', bold: false },
    ],
  },
  {
    img: '/media/org.jpg',
    title: 'Строительно-монтажным организациям',
    description: [
      { text: 'Оснастите ', color: '#000000', bold: false },
      { text: 'объект любой сложности', color: '#d5302c', bold: true },
      { text: ' современными светильниками европейского качества точно в\u00A0срок. ', color: '#000000', bold: false },
      { text: 'Замените дорогие брендовые светильники', color: '#d5302c', bold: true },
      { text: ' на\u00A0продукцию Ledel, с\u00A0гарантией до\u00A010 лет, с\u00A0гарантией и\u00A0сроком поставки от\u00A01 дня.', color: '#000000', bold: false },
    ],
  },
  {
    img: '/media/design.jpg',
    title: 'Дизайнерам и проектировщикам',
    description: [
      { text: 'Найдите ', color: '#000000', bold: false },
      { text: 'аналог европейского дизайнерского светильника', color: '#d5302c', bold: true },
      { text: ' для проекта любой сложности без потери качества и\u00A0гарантии. Замените его на\u00A0продукцию Ledel с\u00A0гарантией до\u00A010 лет.', color: '#000000', bold: false },
    ],
  },
];

export default function TargetAudience() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <section id="target-audience" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Заголовок */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2
            style={{
              fontSize: '24px',
              fontFamily: '"TildaSans", Arial, sans-serif',
              color: '#000000',
              lineHeight: 1.4,
              fontWeight: 'normal',
              margin: 0,
            }}
          >
            Более, чем за 10 лет разработали{' '}
            <span style={{ color: '#d5302c', fontWeight: 'bold' }}>
              выгодные условия
            </span>{' '}
            для разных заказчиков...
          </h2>
        </div>

        {/* Карточки */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, i) => (
            <div 
              key={i} 
              className="text-center cursor-pointer group"
              onClick={() => setActiveIndex(i)}
            >
              {/* Контейнер с изображением */}
              <div
                className={`relative mx-auto mb-6 transition-all duration-300 ${
                  activeIndex === i 
                    ? 'ring-2 ring-red-600 ring-offset-2' 
                    : 'hover:ring-2 hover:ring-gray-300'
                }`}
                style={{
                  width: '259px',
                  height: '173px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={card.img}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 259px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority={i === 0}
                />
              </div>

              {/* Подпись под картинкой */}
              <h3
                className={`transition-colors duration-300 ${
                  activeIndex === i ? 'text-red-600' : 'text-gray-900 group-hover:text-red-500'
                }`}
                style={{
                  fontSize: '18px',
                  fontFamily: '"TildaSans", Arial, sans-serif',
                  lineHeight: '1.4',
                  margin: '0',
                  fontWeight: activeIndex === i ? 'bold' : 'normal',
                }}
              >
                {card.title}
              </h3>
            </div>
          ))}
        </div>

        {/* Блок с описанием */}
        <div className="mt-12 mx-auto px-4" style={{ maxWidth: '1200px' }}>
          <div
            key={activeIndex}
            className="transition-opacity duration-300"
            style={{
              fontSize: '24px',
              fontFamily: '"TildaSans", Arial, sans-serif',
              lineHeight: '1.4',
              color: '#000000',
              fontWeight: 400,
              textAlign: 'center',
            }}
          >
            {cards[activeIndex].description.map((part, idx) => (
              <span
                key={idx}
                style={{
                  color: part.color,
                  fontWeight: part.bold ? 700 : 400,
                }}
              >
                {part.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}