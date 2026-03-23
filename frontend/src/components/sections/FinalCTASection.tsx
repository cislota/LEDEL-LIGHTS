// src/components/sections/FinalCTASection.tsx
'use client';

import { forwardRef } from 'react';
import Image from 'next/image';

interface FinalCTASectionProps {
  ref?: React.Ref<HTMLElement>;
}

const FinalCTASection = forwardRef<HTMLElement, FinalCTASectionProps>((props, ref) => {
  return (
    <section 
      ref={ref} 
      id="final-cta" 
      className="bg-white py-16"
    >
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
              borderRadius: '20px',
            }}
          >
            {/* 1. Логотип */}
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

            {/* 2. Подзаголовок */}
            <div
              className="absolute"
              style={{
                left: '50px',
                top: '180px',
                width: '445px',
              }}
            >
              <p
                style={{
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

            {/* 3. Описание */}
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

            {/* Вертикальная линия */}
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
                <div className="flex-shrink-0 w-17 h-17">
                  <Image
                    src="/media/question_riddle.svg"
                    alt="WhatsApp"
                    width={78}
                    height={78}
                    className="object-contain"
                    style={{ filter: 'brightness(0) invert(1)' }}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <div className="flex flex-col whitespace-nowrap">
                    <div
                      style={{
                        fontSize: '20px',
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
                        fontSize: '20px',
                        fontFamily: '"TildaSans", Arial, sans-serif',
                        color: 'rgba(255,255,255,0.9)',
                      }}
                    >
                      отвечаем в течение 5 минут
                    </div>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-17 h-17">
                  <Image
                    src="/media/envelope_e-mail_mail.svg"
                    alt="Email"
                    width={78}
                    height={78}
                    className="object-contain"
                    style={{ filter: 'brightness(0) invert(1)' }}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <div className="flex flex-col whitespace-nowrap">
                    <div
                      style={{
                        fontSize: '20px',
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
                        fontSize: '20px',
                        fontFamily: '"TildaSans", Arial, sans-serif',
                        color: 'rgba(255,255,255,0.9)',
                        textDecoration: 'underline',
                      }}
                    >
                      info@ledl-lights.ru
                    </a>
                  </div>
                </div>
              </div>

              {/* Телефон */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-17 h-17">
                  <Image
                    src="/media/phone_contact_call_r.svg"
                    alt="Телефон"
                    width={78}
                    height={78}
                    className="object-contain"
                    style={{ filter: 'brightness(0) invert(1)' }}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <div className="flex flex-col whitespace-nowrap">
                    <div
                      style={{
                        fontSize: '20px',
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
                        fontSize: '20px',
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
      </div>
    </section>
  );
});

FinalCTASection.displayName = 'FinalCTASection';

export default FinalCTASection;