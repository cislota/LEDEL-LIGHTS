// src/components/sections/ProjectSliderSection.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProjectSliderSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 6 слайдов
  const slides = [
    {
      img: '/media/WhatsApp-Image-2021-.jpeg',
      title: 'ОСВЕЩЕНИЕ ТАНКА И ПРОИЗВОДСТВЕННОГО ПОМЕЩЕНИЯ, ЗАВОД «ТУЛАМАШ», Г. НИЖНИЙ ТАГИЛ',
      description: 'Компания «СветКонсалт» произвела светотехнический расчет, по запросу клиента, подобрала подходящее оборудование и осуществила монтажные работы.',
      infoButton: 'Архитектурные объекты',
    },
    {
      img: '/media/img_7692.jpg',
      title: 'ГЛАВНЫЙ ОФИС «СБЕРБАНК», Г. САНКТ-ПЕТЕРБУРГ',
      description: 'Решение от специалистов ГК «СветКонсалт» позволило сократить общее число светильников, заложенное в дизайн-проекте, и при этом обеспечить уровень освещенности, превышающий положенный по стандартам на 20%. Теплый спектр излучения создал максимально комфортную для персонала и посетителей офиса атмосферу. На лестничных пролетах установили 34 точечных светильника. С их помощью организовали общее освещение и акцентный нижний свет.',
      infoButton: 'Торговое освещение',
    },
    {
      img: '/media/img_7042-1_thumb.jpg',
      title: 'АВТОСАЛОН MERCEDES-BENZ',
      description: 'Компанией «СветКонсалт» был разработан полный светотехнический проект и установлено высокоэффективное светодиодное оборудование, удовлетворяющее потребности заказчика, а также соблюдающее все требования автопроизводителя Mercedes-Benz.',
      infoButton: 'Торговое освещение',
    },
    {
      img: '/media/kfc2.jpg',
      title: 'НАРУЖНОЕ ОСВЕЩЕНИЕ РЕСТОРАНА KFC, ПСКОВ',
      description: 'Сотрудниками компании «СветКонсалт» было произведено освещение парковки и периметра здания магазина.',
      infoButton: 'Уличное освещение',
    },
    {
      img: '/media/1ulichnoe-1024x575.jpg',
      title: 'ФИДЖИТАЛ-ЦЕНТР В КЕМЕРОВО',
      description: 'Проект от светотехнического расчета до поставки оборудования выполнили специалисты «СветКонсалт». Для освещения внутренних помещений Фиджитал-центра выбрали светодиодные светильники линейного типа мощностью 20, 30 и 40Вт. Все изделия были окрашены в черный цвет по RAL 9005 в соответствии с дизайн-проектом оформления внутреннего пространства. Всего на объекте был установлен 91 LED-светильник.',
      infoButton: 'Спортивные объекты',
    },
    {
      img: '/media/mobile_file_2022-08-.jpg',
      title: 'СПОРТИВНАЯ ПЛОЩАДКА МБОУ СОШ № 18, СВЕРДЛОВСКАЯ ОБЛАСТЬ',
      description: 'Компания «СветКонсалт» предоставила индивидуальный светотехнический расчет и на его основе подобрала нужное оборудование.',
      infoButton: 'Спортивные объекты',
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
    <section id="projects" className="bg-white py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-4">
        
        {/* Блок 1: Заголовок — адаптивный */}
        <div className="w-full max-w-[1492px] mx-auto">
          <h2
            className="px-4"
            style={{
              fontSize: 'clamp(28px, 5vw, 42px)',
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

        {/* Блок 2: Слайдер — адаптивный */}
        <div className="w-full max-w-[1492px] mx-auto mt-8 md:mt-12">
          <div className="relative w-full" style={{ minHeight: '424px' }}>
            
            {/* Контент — в рамках 1160px, центрированный */}
            <div 
              className="absolute inset-0 mx-auto" 
              style={{ 
                maxWidth: '1160px', 
                left: '50%', 
                transform: 'translateX(-50%)',
                minHeight: '424px',
              }}
            >
              
              {/* Изображение — 460×288, абсолютное позиционирование */}
              <div className="absolute left-0 top-0 w-[460px] h-[288px]">
                <Image
                  src={currentSlide.img}
                  alt={currentSlide.title}
                  width={460}
                  height={288}
                  className="w-full h-full object-cover rounded-lg"
                  priority={currentIndex === 0}
                />
              </div>

              {/* Текстовый блок — справа, фиксированная высота 288px как у изображения */}
              <div
                className="flex flex-col absolute"
                style={{
                  left: '500px',
                  top: '0',
                  width: '533px',
                  height: '288px',
                }}
              >
                {/* Заголовок — всегда сверху, фиксированная высота */}
                <div className="flex-shrink-0 mb-2" style={{ minHeight: '45px' }}>
                  <h3
                    style={{
                      fontSize: '32px',
                      fontFamily: '"TildaSans", Arial, sans-serif',
                      fontWeight: 'bold',
                      color: '#000000',
                      lineHeight: 1.1,
                      margin: 0,
                      textAlign: 'left',
                    }}
                    // Подсветка ключевых фраз
                    dangerouslySetInnerHTML={highlightTitle(currentSlide.title)}
                  />
                </div>

                {/* Описание — гибкий блок, занимает оставшееся место */}
                <div 
                  className="flex-1 mb-2 overflow-hidden"
                  style={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  <p
                    style={{
                      fontSize: '16px',
                      fontFamily: '"TildaSans", Arial, sans-serif',
                      color: '#000000',
                      fontWeight: 'normal',
                      lineHeight: '21px',
                      margin: 0,
                      textAlign: 'left',
                      whiteSpace: 'normal',
                      wordWrap: 'break-word',
                    }}
                  >
                    {currentSlide.description}
                  </p>
                </div>

                {/* Информативная кнопка — всегда внизу, высота 57px */}
                <div
                  className="flex-shrink-0"
                  style={{
                    width: '266px',
                    height: '57px',
                    backgroundColor: '#d5302c',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 'auto',
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

              {/* Стрелки навигации — под изображением */}
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
                  aria-label="Следующий слайд"
                  className="flex items-center justify-center"
                  style={{ width: '17px', height: '32px' }}
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
        </div>
      </div>
    </section>
  );
}

// Функция для подсветки красным цветом
const highlightTitle = (text: string) => {
  const highlights = [
    'ОСВЕЩЕНИЕ ТАНКА И ПРОИЗВОДСТВЕННОГО ПОМЕЩЕНИЯ,',
    'ГЛАВНЫЙ ОФИС «СБЕРБАНК»,',
    'НАРУЖНОЕ ОСВЕЩЕНИЕ',
    'ФИДЖИТАЛ-ЦЕНТР',
    'СПОРТИВНАЯ ПЛОЩАДКА',
    'АВТОСАЛОН',
  ];

  let result = text;
  
  highlights.forEach((phrase) => {
    const escaped = phrase.replace(/[«»",]/g, '\\$&');
    result = result.replace(
      new RegExp(`(${escaped})`, 'g'),
      `<span style="color:#d5302c;font-weight:bold">$1</span>`
    );
  });

  return { __html: result };
};