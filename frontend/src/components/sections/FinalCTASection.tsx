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
              left: '199px',
              top: '22px',
              width: '1162px',
              height: '626px',
              backgroundColor: '#d5302c',
            }}
          >
            {/* 1. Логотип — отступ слева 50px */}
            <div
              className="absolute"
              style={{
                left: '-32px',
                top: '40px',
                width: '533px',
                height: '173px',
              }}
            >
              <Image
                src="/media/_.png.webp"
                alt="СветКонсалт"
                width={533}
                height={173}
                className="w-full h-full object-contain"
                priority
              />
            </div>

            {/* 2. Подзаголовок — отступ слева 50px */}
            <div
              className="absolute" 
              style={{
                left: '50px',
                top: '180px',
                width: '445px',
              }}
            >
              <p
                style = {{
                  fontSize: '28px',
                  fontFamily: '"TildaSans", Arial, sans-serif',
                  color: '#ffffff',
                  lineHeight: '34px',
                  margin: 0,
                }}
              >
                <strong>Экономьте сотни тысяч рублей</strong> и&nbsp;зарабатывайте с&nbsp;помощью опыта ООО "СветКонсалт"
              </p>
            </div>

            {/* 3. Описание — один абзац */}
            <div
              className="absolute"
              style={{
                left: '50px',
                top: '290px',
                width: '560px',
                height: '210px',
              }}
            >
              <p
                style={{
                  fontSize: '20px',
                  fontFamily: '"TildaSans", Arial, sans-serif',
                  color: '#ffffff',
                  lineHeight: '31px',
                  margin: 0,
                  whiteSpace: 'pre-line',
                }}
              >
                Продажу продукции осуществляет ГК «СветКонсалт» — официальный представитель завода-изготовителя. Наши специалисты оснащают объекты LED светильниками более 10 лет и являются экспертами в своем деле. За годы работы реализованы проекты практически во всех сферах — от медцентров и стадионов до аэропортов и угольных шахт.
              </p>
            </div>

            {/* Вертикальная разделительная линия */}
            <div
              className="absolute"
              style={{
                left: '657px',
                top: '75px',
                width: '2px',
                height: '475px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              }}
            />

            {/* Контакты */}
            <div
              className="absolute"
              style={{
                left: '720px',
                top: '200px',
                width: '300px',
              }}
            >
              {/* WhatsApp */}
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-6 h-6">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
                <div className="flex-shrink-0 w-6 h-6">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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