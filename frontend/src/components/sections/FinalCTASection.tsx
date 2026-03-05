// src/components/sections/FinalCTASection.tsx
'use client';

import Image from 'next/image';

export default function FinalCTASection() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Общий контейнер: 1560×670 */}
        <div
          className="relative mx-auto"
 style={{ width: '1560px', height: '670px' }}
        >
          {/* Красный внутренний контейнер: 1162×626 */}
          <div
            className="absolute"
            style={{
              left: '199px', // (1560 - 1162) / 2 = 199
              top: '22px',   // (670 - 626) / 2 = 22
              width: '1162px',
              height: '626px',
              backgroundColor: '#d5302c',
            }}
          >
            {/* Логотип — изображение 533×173 */}
            <div
              className="absolute"
              style={{
                left: '0',
                top: '0',
                width: '533px',
                height: '173px',
              }}
            >
              <Image
                src="/media/logo-svetkonsalt.png"
                alt="СветКонсалт"
                width={533}
                height={173}
                className="w-full h-full object-contain"
                priority
              />
            </div>

            {/* Подзаголовок — 28px, "Экономьте..." жирный */}
            <div
              className="absolute"
              style={{
                left: '560px', // 533 + 27 отступ
                top: '0',
                width: '533px',
                paddingTop: '20px',
              }}
            >
              <p
                style={{
                  fontSize: '28px',
                  fontFamily: '"TildaSans", Arial, sans-serif',
                  color: '#ffffff',
                  lineHeight: 1.4,
                  margin: 0,
                }}
              >
                <strong>Экономьте сотни тысяч рублей</strong> и зарабатывайте с помощью опыта ООО "СветКонсалт"
              </p>
            </div>

            {/* Описание — 20px, без отступов */}
            <div
              className="absolute"
              style={{
                left: '560px',
                top: '100px',
                width: '533px',
              }}
            >
              <p
                style={{
                  fontSize: '20px',
                  fontFamily: '"TildaSans", Arial, sans-serif',
                  color: '#ffffff',
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                Продажу продукции осуществляет ГК «СветКонсалт» — официальный представитель завода-изготовителя.
              </p>
              <p
                style={{
                  fontSize: '20px',
                  fontFamily: '"TildaSans", Arial, sans-serif',
                  color: '#ffffff',
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                Наши специалисты оснащают объекты LED светильниками более 10 лет и являются экспертами в своем деле.
              </p>
              <p
                style={{
                  fontSize: '20px',
                  fontFamily: '"TildaSans", Arial, sans-serif',
                  color: '#ffffff',
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                За годы работы реализованы проекты практически во всех сферах — от медцентров и стадионов до аэропортов и угольных шахт.
              </p>
            </div>

            {/* Вертикальная разделительная линия */}
            <div
              className="absolute"
              style={{
                left: '697px', // 1162 * 0.6 = 697
                top: '75px',   // центрируем по высоте: (626 - 475) / 2 = 75 
                width: '2px',
                height: '475px',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              }}
            />

            {/* Контакты */}
            <div
              className="absolute"
              style={{
                left: '720px', // 697 + 23 (отступ от линии)
                top: '200px',
                width: '300px',
              }}
            >
              {/* WhatsApp */}
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-6 h-6">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.5 14.5C17.5 14.5 16.5 14 16.5 13.5C16.5 13 16.5 12.5 16.5 12.5" stroke="white" strokeWidth="2"/>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Z" stroke="white" strokeWidth="2"/>
                    <path d="M12 17C14.21 17 16 15.21 16 13C16 10.79 14.21 9 12 9C9.79 9 8 10.79 8 13C8 15.21 9.79 17 12 17Z" stroke="white" strokeWidth="2"/>
                  </svg>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '16px',
                      fontFamily: '"TildaSans", Arial, sans-serif',
                      color: '#ffffff',
                      fontWeight: 'bold',
                      marginBottom: '4px',
                    }}
                  >
                    Обсудим проект в WhatsApp:
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontFamily: '"TildaSans", Arial, sans-serif',
                      color: 'rgba(255,255,255,0.9)',
                    }}
                  >
                    отвечаем в течение 5 минут
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-6 h-6">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z" stroke="white" strokeWidth="2"/>
                    <path d="M22 6L12 13L2 6" stroke="white" strokeWidth="2"/>
                  </svg>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '16px',
                      fontFamily: '"TildaSans", Arial, sans-serif',
                      color: '#ffffff',
                      fontWeight: 'bold',
                      marginBottom: '4px',
                    }}
                  >
                    Задайте вопрос на эл. почту:
                  </div>
                  <a
                    href="mailto:info@ledl-lights.ru"
                    style={{
                      fontSize: '14px',
                      fontFamily: '"TildaSans", Arial, sans-serif',
                      color: 'rgba(255,255,255,0.9)',
                      textDecoration: 'underline',
                    }}
                  >
                    info@ledl-lights.ru
                  </a>
                </div>
              </div>

              {/* Телефон */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-6 h6">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Z" stroke="white" strokeWidth="2"/>
                    <path d="M12 17C14.21 17 16 15.21 16 13C16 10.79 14.21 9 12 9C9.79 9 8 10.79 8 13C8 15.21 9.79 17 12 17Z" stroke="white" strokeWidth="2"/>
                  </svg>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '16px',
                      fontFamily: '"TildaSans", Arial, sans-serif',
                      color: '#ffffff',
                      fontWeight: 'bold',
                      marginBottom: '4px',
                    }}
                  >
                    Позвоните нам:
                  </div>
                  <a
                    href="tel:88003510975"
                    style={{
                      fontSize: '14px',
                      fontFamily: '"TildaSans", Arial, sans-serif',
                      color: 'rgba(255,255,255,0.9)',
                      textDecoration: 'underline',
                    }}
                  >
                    8 (800) 351-09-75
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}