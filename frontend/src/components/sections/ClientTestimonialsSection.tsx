// src/components/sections/ClientTestimonialsSection.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ClientTestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const testimonials = [
    {
      title: '«В КАЧЕСТВЕ БОНУСА НАМ БЫЛА ОРГАНИЗОВАНА ДОСТАВКА ЗА СЧЁТ ПОСТАВЩИКА»',
      text: 'Стояла задача создать стильный, современный и в то же время светлый офис. Производство, доставка и монтаж пришел в заранее оговоренные в договоре сроки. Рекомендуем «СветКонсалт» для сотрудничества!',
      signature: 'Генеральный директор Сарычев И. Ф.',
      docImg: '/media/-_.jpg.webp',
      badge: 'Благодарственное письмо от компании Ланит-Терком',
    },
    {
      title: '«НА ДАННЫЙ МОМЕНТ У НАС УЖЕ ОСУЩЕСТВЛЕНО 3 ПОСТАВКИ И 1 ПРОЕКТ НА СТАДИИ РЕАЛИЗАЦИИ»',
      text: 'Сотрудничество началось в 2018 году при подборе необходимого оборудования для освещения наших объектов (внутренних помещений музейного комплекса и уличной территории комплекса). Спасибо компании "СветКонсалт" и лично менеджеру за проявленный профессионализм! Надеемся на дальнейшее долгое и плодотворное сотрудничество!',
      signature: 'Главный инженер Шалаев А. А.',
      docImg: '/media/_.jpg.webp',
      badge: 'Благодарственное письмо от компании Беляна',
    },
    {
      title: '«ВСЯ ПРОДУКЦИЯ БЫЛА АККУРАТНО И НАДЕЖНО УПАКОВАНА И ДОСТАВЛЕНА В УСТАНОВЛЕННЫЙ СРОК»',
      text: 'Благодарю Вас за помощь в реализации Государственного контракта на поставку уличных светильников!',
      signature: 'Генеральный директор Чиркова Н.Г.',
      docImg: '/media/__.jpg.webp',
      badge: 'Благодарственное письмо от компании Гросс',
    },
    {
      title: '«ВСЕ ПОЖЕЛАНИЯ НАШЕЙ КОМПАНИИ, ВОЗНИКШИЕ В ХОДЕ РАБОТЫ И ПОСЛЕ МОНТАЖА, УЧИТЫВАЛИСЬ И ИСПОЛНЯЛИСЬ В КРАТЧАЙШИЕ СРОКИ!»',
      text: 'Выражаем благодарность «СветКонсалт» за проделанную работу и можем порекомендовать ее как надежного партнера.',
      signature: 'Директор филиала А. Г. Нефедов',
      docImg: '/media/photo.jpg.webp',
      badge: 'Благодарственное письмо от компании Евраз',
    },
    {
      title: '«МЫ ИСКРЕННЕ РАДЫ ВОЗМОЖНОСТИ РАБОТАТЬ С ВАМИ НАД СОВМЕСТНЫМИ ПРОЕКТАМИ»',
      text: 'ООО "РЭС" спешит поблагодарить Вас за сотрудничество! Особенно мы признательны Вам и Вашему коллективу в лице менеджера, за порядочность, взаимовыручку и серьезное отношение к работе!',
      signature: 'Генеральный директор Третьяков А. А.',
      docImg: '/media/_(1).jpg.webp',
      badge: 'Благодарственное письмо от компании РЭС',
    },
    {
      title: '«ОСОБЕННАЯ БЛАГОДАРНОСТЬ МЕНЕДЖЕРУ ПО ПРОДАЖАМ!»',
      text: 'АО, «Сокол» выражает признательность вашей фирме за проделанную работу по освещению фасада нашего предприятия!',
      signature: 'Управляющий В. Г. Орешко',
      docImg: '/media/_(2).jpg.webp',
      badge: 'Благодарственное письмо от компании Сокол',
    },
    {
      title: '«ПОСЛЕ УСТАНОВКИ ПРЕДЛОЖЕННЫХ ВАШИМИ СПЕЦИАЛИСТАМИ СВЕТИЛЬНИКОВ ИЗМЕНИЛСЯ УРОВЕНЬ ОСВЕЩЕННОСТИ В ЛУЧШУЮ СТОРОНУ!»',
      text: 'В краткие сроки приехал Ваш специалист — произвел замер освещенности, продемонстрировал образцы светильников. В этот же день были предложены светодиодные панели с равномерной засветкой. Далее планируем произвести замену прожекторов наружного освещения, сотрудничать будем снова с Вашей компанией, что и рекомендуем другим!',
      signature: 'Генеральный директор А. В. Соколов',
      docImg: '/media/-2_.jpg.webp',
      badge: 'Благодарственное письмо от компании СПАРЗ',
    },
    {
      title: '«РЕКОНСТРУКЦИЯ ПОЗВОЛИЛА СУЩЕСТВЕННО СОКРАТИТЬ ЗАТРАТЫ НА ЭЛЕКТРОЭНЕРГИЮ И ОБСЛУЖИВАНИЕ!»',
      text: 'С ГК «СветКонсалт» нам удалось успешно реализовать комплексный проект освещения нашего объекта, а именно внутрицеховое и офисное освещение. Надеемся на дальнейшее плодотворное сотрудничество!',
      signature: 'Главный инженер Бурмистенко С. А.',
      docImg: '/media/__(1).jpg.webp',
      badge: 'Благодарственное письмо от компании Терминал Западный',
    },
  ];

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Сбрасываем анимацию после завершения
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 350);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const current = testimonials[currentIndex];

  return (
    <section id="testimonials" className="bg-gray-100 py-16">
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

        {/* Белый контейнер — фиксированный размер */}
        <div
          className="bg-white rounded-2xl shadow-lg mx-auto overflow-hidden"
          style={{
            borderRadius: '40px',
            padding: '40px',
            width: '1044px',
            height: '532px',
            boxSizing: 'border-box',
            maxWidth: '100%',
          }}
        >
          {/* ✅ Анимированный слайд */}
          <div 
            key={currentIndex} 
            className="flex flex-col h-full animate-fade-slide"
          >
            {/* Верхняя часть: текст и изображение */}
            <div className="flex flex-col lg:flex-row items-start gap-8 flex-1 overflow-hidden">
              {/* Левая часть: текст отзыва */}
              <div className="flex-1 min-w-0 flex flex-col">
                {/* Бейдж */}
                <div
                  className="inline-block mb-6 py-2 bg-red-600 text-white font-normal rounded-full text-center"
                  style={{
                    letterSpacing: '0.5px',
                    fontSize: '16px',
                    width: '575px',
                    height: '53px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxSizing: 'border-box',
                  }}
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
                  className="mb-6 text-lg flex-1 overflow-y-auto"
                  style={{
                    fontFamily: '"TildaSans", Arial, sans-serif',
                    color: '#000000',
                    lineHeight: 1.6,
                  }}
                >
                  {current.text}
                </p>
              </div>

              {/* Правая часть: изображение документа — 267×400 */}
              <div className="flex-shrink-0" style={{ width: '267px', height: '400px' }}>
                <Image
                  src={current.docImg}
                  alt="Благодарственное письмо"
                  width={267}
                  height={400}
                  className="w-full h-full object-cover rounded-lg"
                  priority={currentIndex === 0}
                />
              </div>
            </div>

            {/* Нижняя часть: ФИО и кнопки — зафиксированы внизу с отступом */}
            <div
              className="flex items-center gap-4 mt-auto pt-4"
              style={{ paddingBottom: '5px' }}
            >
              {/* Подпись */}
              <div
                className="px-6 py-3 bg-gray-200 rounded-lg"
                style={{
                  borderRadius: '20px',
                  width: '340px',
                  height: '42px',
                  fontSize: '16px',
                  fontFamily: '"TildaSans", Arial, sans-serif',
                  color: '#000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxSizing: 'border-box',
                }}
              >
                {current.signature}
              </div>

              {/* Стрелки навигации */}
              <div className="flex gap-2">
                {/* Кнопка влево — светло-розовая */}
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Предыдущий отзыв"
                  disabled={isAnimating}
                  className="flex items-center justify-center rounded-lg transition "
                  style={{
                    width: '42px',
                    height: '42px',
                    backgroundColor: '#ffc4c2',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#000000',
                    border: 'none',
                    cursor: isAnimating ? 'not-allowed' : 'pointer',
                    borderRadius: '8px',
                  }}
                >
                  &lt;
                </button>

                {/* Кнопка вправо — красная */}
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Следующий отзыв"
                  disabled={isAnimating}
                  className="flex items-center justify-center rounded-lg transition"
                  style={{
                    width: '42px',
                    height: '42px',
                    backgroundColor: '#d5302c',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    border: 'none',
                    cursor: isAnimating ? 'not-allowed' : 'pointer',
                    borderRadius: '8px',
                  }}
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}