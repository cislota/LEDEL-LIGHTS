// src/components/sections/CatalogSection.tsx
'use client';

import Image from 'next/image';

export default function CatalogSection() {
  const products = [
    {
      id: 1,
      img: '/media/light-1.jpg.webp',
      nameMain: 'Светильник L-banner',
      nameSpec: '600/600/Г30/5,0K/04/220AC IP66',
      type: 'Прожектор',
    },
    {
      id: 2,
      img: '/media/light-1.jpg.webp',
      nameMain: 'Светильник L-banner',
      nameSpec: '600/600/Г60/4,0K/04/220AC IP66',
      type: 'Прожектор',
    },
    {
      id: 3,
      img: '/media/light-1.jpg.webp',
      nameMain: 'Светильник L-banner',
      nameSpec: '600/600/Г30/4,0K/04/220AC IP66',
      type: 'Прожектор',
    },
    {
      id: 4,
      img: '/media/light-1.jpg.webp',
      nameMain: 'Светильник L-banner',
      nameSpec: '600/600/Г40/5,0K/04/220AC IP66',
      type: 'Прожектор',
    },
    {
      id: 5,
      img: '/media/light-1.jpg.webp',
      nameMain: 'Светильник L-banner',
      nameSpec: '600/600/Г50/4,0K/04/220AC IP66',
      type: 'Прожектор',
    },
    {
      id: 6,
      img: '/media/light-1.jpg.webp',
      nameMain: 'Светильник L-banner',
      nameSpec: '600/600/Г70/5,0K/04/220AC IP66',
      type: 'Прожектор',
    },
    {
      id: 7,
      img: '/media/light-1.jpg.webp',
      nameMain: 'Светильник L-banner',
      nameSpec: '600/600/Г20/4,0K/04/220AC IP66',
      type: 'Прожектор',
    },
    {
      id: 8,
      img: '/media/light-1.jpg.webp',
      nameMain: 'Светильник L-banner',
      nameSpec: '600/600/Г80/5,0K/04/220AC IP66',
      type: 'Прожектор',
    },
    {
      id: 9,
      img: '/media/light-1.jpg.webp',
      nameMain: 'Светильник L-banner',
      nameSpec: '600/600/Г90/4,0K/04/220AC IP66',
      type: 'Прожектор',
    },
  ];

  const categories = [
    'Все',
    'Промышленное освещение',
    'Уличное освещение',
    'Офисное освещение',
    'Коммерческое освещение',
    'Архитектурно-парковое освещение',
  ];

  return (
    <section id="catalog" className="bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Заголовок */}
        <h2
          className="text-center mb-6"
          style={{
            fontSize: '42px',
            fontFamily: '"TildaSans", Arial, sans-serif',
            fontWeight: 'bold',
            color: '#000000',
            lineHeight: 1.2,
          }}
        >
          Тысячи светильников под любые задачи с доставкой от 1 дня
        </h2>

        {/* Подзаголовок */}
        <p
          className="text-center max-w-4xl mx-auto mb-12"
          style={{
            fontSize: '24px',
            fontFamily: '"TildaSans", Arial, sans-serif',
            color: '#000000',
            lineHeight: 1.5,
            fontWeight: 'normal',
          }}
        >
          В нашем каталоге представлены тысячи светильников на все случаи жизни.{' '}
          <strong style={{ color: '#d5302c', fontWeight: 'bold' }}>
            Это лишь некоторые из наших моделей.
          </strong>{' '}
          Свяжитесь с нами, и мы подберем идеальные светильники для вашего проекта!
        </p>

        {/* Основной контент */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Левое меню */}
          <div
            className="bg-gray-100 p-6 rounded-2xl"
            style={{ width: '290px', height: '1375px', flexShrink: 0 }}
          >
            <ul className="space-y-4">
              {categories.map((cat, i) => (
                <li key={i}>
                  <button
                    className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-200 transition"
                    style={{
                      fontSize: '16px',
                      fontFamily: '"TildaSans", Arial, sans-serif',
                      color: '#000000',
                      fontWeight: 'normal',
                    }}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Каталог справа */}
          <div
            className="bg-white p-6 rounded-2xl"
            style={{ width: '870px', height: '1375px', flexShrink: 0 }}
          >
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
              style={{ gap: '100px 50px' }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col"
                  style={{ width: '279px', height: '300px' }}
                >
                  {/* Изображение — контейнер 279×209 */}
                  <div
                    className="overflow-hidden"
                    style={{
                      width: '279px',
                      height: '209px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Image
                      src={product.img}
                      alt={product.nameMain}
                      width={279}
                      height={157}
                      className="w-full h-auto object-cover"
                      priority={product.id === 1}
                    />
                  </div>

                  {/* Текстовая часть — 279×188 */}
                  <div
                    className="flex flex-col"
                    style={{
                      width: '279px',
                      height: '188px',
                      gap: '8px',
                    }}
                  >
                    {/* Наименование — 279×54 */}
                    <div
                      className="flex flex-col justify-center"
                      style={{
                        width: '279px',
                        height: '54px',
                        textAlign: 'center',
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '20px',
                          fontFamily: '"TildaSans", Arial, sans-serif',
                          color: '#000000',
                          fontWeight: 600,
                          lineHeight: 1.2,
                          margin: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {product.nameMain}
                      </h3>
                      <div
                        style={{
                          fontSize: '18px',
                          fontFamily: '"TildaSans", Arial, sans-serif',
                          color: '#000000',
                          fontWeight: 600,
                          lineHeight: 1.2,
                          marginTop: '2px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {product.nameSpec}
                      </div>
                    </div>

                    {/* Тип — 279×21 */}
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: '279px',
                        height: '21px',
                      }}
                    >
                      <p
                        style={{
                          fontSize: '14px',
                          fontFamily: '"TildaSans", Arial, sans-serif',
                          color: '#666666',
                          fontWeight: 'normal',
                          lineHeight: 1,
                          margin: 0,
                          textAlign: 'center',
                        }}
                      >
                        {product.type}
                      </p>
                    </div>

                    {/* Кнопка — 279×53 */}
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: '279px',
                        height: '53px',
                      }}
                    >
                      <button
                        className="w-[143px] h-[45px] bg-red-600 text-white font-bold rounded-[30px] hover:bg-red-700 transition flex items-center justify-center"
                        style={{
                          fontSize: '14px',
                          fontFamily: '"TildaSans", Arial, sans-serif',
                          textAlign: 'center',
                        }}
                      >
                        ПОДРОБНЕЕ
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}