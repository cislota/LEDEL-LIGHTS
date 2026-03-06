// src/components/sections/ProjectSliderSection.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProjectSliderSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 7 слайдов
  const slides = [
    {
      img: '/media/WhatsApp-Image-2021-.jpeg',
      title: 'Освещение танка и производственного помещения, Завод «Туламаш», г. Нижний Тагил ',
      description: 'Компания «СветКонсалт» произвела светотехнический расчет, по запросу клиента, подобрала подходящее оборудование и осуществила монтажные работы.',
      infoButton: 'Архитектурные объекты',
    },
    {
      img: '/media/img_7692.jpg',
      title: 'Главный офис «Сбербанк»,г. Санкт-Петербург',
      description: 'Решение от специалистов ГК «СветКонсалт» позволило сократить общее число светильников, заложенное в дизайн-проекте, и при этом обеспечить уровень освещенности, превышающий положенный по стандартам на 20%. Теплый спектр излучения создал максимально комфортную для персонала и посетителей офиса атмосферу. На лестничных пролетах установили 34 точечных светильника. С их помощью организовали общее освещение и акцентный нижний свет.',
      infoButton: 'Торговое освещение',
    },
    {
      img: '/media/img_7042-1_thumb.jpg',
      title: 'Автосалон Mercedes-Benz',
      description: 'Компанией «СветКонсалт» был разработан полный светотехнический проект и установлено высокоэффективное светодиодное оборудование, удовлетворяющее потребности заказчика, а также соблюдающее все требования автопроизводителя Mercedes-Benz.',
      infoButton: 'Торговое освещение',
    },
    {
      img: '/media/kfc2.jpg',
      title: 'Наружное освещение ресторана KFC, Псков',
      description: 'Сотрудниками компании «СветКонсалт» было произведено освещение парковки и периметра здания магазина.',
      infoButton: 'Уличное освещение',
    },
    {
      img: '/media/1ulichnoe-1024x575.jpg',
      title: 'Фиджитал-центр в Кемерово',
      description: 'Проект от светотехнического расчета до поставки оборудования выполнили специалисты «СветКонсалт». Для освещения внутренних помещений Фиджитал-центра выбрали светодиодные светильники линейного типа мощностью 20, 30 и 40Вт. Все изделия были окрашены в черный цвет по RAL 9005 в соответствии с дизайн-проектом оформления внутреннего пространства. Всего на объекте был установлен 91 LED-светильник.',
      infoButton: 'Спортивные объекты',
    },
    {
      img: '/media/mobile_file_2022-08-.jpg',
      title: 'Спортивная площадка МБОУ СОШ № 18, Свердловская область',
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
    <section id="projects" className="bg-white py-16">
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
    </section>
  );
}