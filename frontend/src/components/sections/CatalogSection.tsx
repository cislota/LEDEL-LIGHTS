// src/components/sections/CatalogSection.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';

interface Product {
  id: number;
  img: string;
  nameMain: string;
  nameSpec: string;
  type: string;
  category: string;
  price?: string;
}

export default function CatalogSection() {
  const [activeCategory, setActiveCategory] = useState('Все');
  const [visibleCount, setVisibleCount] = useState(9);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['Все']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔄 Загрузка товаров...');
        
        const response = await fetch('/api/tilda-products');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📦 Получены данные:', data);

        // Извлекаем массив products из ответа API
        const productsData = data.products || [];
        console.log('📦 Продуктов найдено:', productsData.length);

        // 🔍 Отладка: смотрим структуру первого товара
        if (productsData.length > 0) {
          console.log('🔍 Структура первого товара:', Object.keys(productsData[0]));
          console.log('🔍 images поле:', productsData[0].images);
          console.log('🔍 title:', productsData[0].title);
        }

        // Фильтруем и преобразуем данные
        const formattedProducts: Product[] = productsData
          .filter((p: any) => {
            // Более мягкий фильтр: проверяем только наличие названия с "Светильник"
            const hasTitle = p.title?.includes('Светильник') && p.title?.length > 10;
            return hasTitle;
          })
          .map((p: any, i: number) => {
            // Разделяем title на nameMain и nameSpec
            const nameParts = p.title?.split('/') || ['Светильник'];
            const nameMain = nameParts[0] || 'Светильник';
            const nameSpec = nameParts.slice(1).join('/') || p.text || '';
            
            // Определяем категорию по nameMain
            let category = 'Промышленное освещение';
            if (nameMain.includes('L-street')) {
              category = 'Уличное освещение';
            } else if (nameMain.includes('L-office') || nameMain.includes('L-fusion Office')) {
              category = 'Офисное освещение';
            } else if (nameMain.includes('L-fusion Retail')) {
              category = 'Коммерческое освещение';
            } else if (nameMain.includes('L-contour') || nameMain.includes('L-facade')) {
              category = 'Архитектурно-парковое освещение';
            }

            // 🔍 Получаем изображение: пробуем разные поля
            let imgUrl = '/media/prom.webp'; // заглушка по умолчанию
            
            // Вариант 1: images[0].url (стандартный формат Tilda API)
            if (p.images?.[0]?.url) {
              imgUrl = p.images[0].url;
            }
            // Вариант 2: img (если данные уже преобразованы)
            else if (p.img) {
              imgUrl = p.img;
            }
            // Вариант 3: определяем по категории
            else if (category === 'Уличное освещение') {
              imgUrl = '/media/ul.webp';
            } else if (category === 'Офисное освещение') {
              imgUrl = '/media/of.webp';
            } else if (category === 'Коммерческое освещение') {
              imgUrl = '/media/kom.webp';
            } else if (category === 'Архитектурно-парковое освещение') {
              imgUrl = '/media/arch.webp';
            }

            return {
              id: i + 1,
              img: imgUrl,
              nameMain: nameMain.trim(),
              nameSpec: nameSpec.trim(),
              type: category === 'Промышленное освещение' ? 'Прожектор' : 'Светильник',
              category: category,
              price: p.price?.display || '',
            };
          });

        console.log('✅ Отформатировано товаров:', formattedProducts.length);
        if (formattedProducts.length > 0) {
          console.log('📋 Пример первого товара:', formattedProducts[0]);
        }
        
        setProducts(formattedProducts);

        // Получаем уникальные категории
        const uniqueCategories = [
          'Все',
          ...Array.from(new Set(formattedProducts.map((p: Product) => p.category).filter(Boolean))) as string[],
        ];
        
        console.log('📂 Категории:', uniqueCategories);
        setCategories(uniqueCategories);

      } catch (err) {
        console.error('❌ Ошибка загрузки товаров:', err);
        setError(`Не удалось загрузить товары: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Фильтрация товаров по категории
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'Все') {
      return products;
    }
    return products.filter((p) => p.category === activeCategory);
  }, [activeCategory, products]);

  // Отображаемые товары
  const visibleProducts = filteredProducts.slice(0, visibleCount);

  // Сброс при смене категории
  useEffect(() => {
    setVisibleCount(9);
  }, [activeCategory]);

  // Обработчик загрузки ещё
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 9);
  };

  // Показывать кнопку, если есть ещё товары
  const hasMore = visibleCount < filteredProducts.length;

  if (loading) {
    return (
      <section id="catalog" className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-6 text-4xl font-bold">Загрузка каталога...</h2>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#d5302c]"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="catalog" className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <p className="text-red-600 text-xl mb-4">❌ {error}</p>
            <p className="text-gray-600">Откройте консоль браузера (F12) для деталей</p>
          </div>
        </div>
      </section>
    );
  }

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
          {/* Левое меню — динамическая высота */}
          <div
            className="bg-gray-100 p-6 rounded-2xl"
            style={{
              width: '290px',
              flexShrink: 0,
              height: 'fit-content',
              minHeight: '500px',
            }}
          >
            <ul className="space-y-4">
              {categories.map((cat, i) => (
                <li key={i}>
                  <button
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left py-3 px-4 rounded-lg transition ${
                      activeCategory === cat
                        ? 'bg-[#d5302c] text-white font-semibold'
                        : 'hover:bg-gray-200'
                    }`}
                    style={{
                      fontSize: '16px',
                      fontFamily: '"TildaSans", Arial, sans-serif',
                      fontWeight: activeCategory === cat ? '600' : '400',
                    }}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Каталог справа */}
          <div className="flex-1">
            {visibleProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-600 text-xl">Товары не найдены</p>
              </div>
            ) : (
              <>
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  style={{ gap: '100px 50px' }}
                >
                  {visibleProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex flex-col"
                      style={{ width: '279px', height: '300px' }}
                    >
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
                          priority={product.id <= 9}
                        />
                      </div>

                      <div
                        className="flex flex-col"
                        style={{
                          width: '279px',
                          height: '188px',
                          gap: '8px',
                        }}
                      >
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

                {hasMore && (
                  <div className="flex justify-center mt-12">
                    <button
                      onClick={handleLoadMore}
                      className="px-12 py-4 bg-[#d5302c] text-white font-bold rounded-[30px] hover:bg-[#b52824] transition"
                      style={{
                        fontSize: '16px',
                        fontFamily: '"TildaSans", Arial, sans-serif',
                        marginLeft: 'calc(279px + 50px + 139.5px)',
                        transform: 'translateX(-164%)',
                      }}
                    >
                      ЗАГРУЗИТЬ ЕЩЁ
                    </button>
                  </div>
                )}

                <div
                  className="text-center mt-6"
                  style={{
                    marginLeft: 'calc(279px + 50px + 139.5px)',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <p
                    className="text-gray-600"
                    style={{
                      fontSize: '16px',
                      fontFamily: '"TildaSans", Arial, sans-serif',
                    }}
                  >
                    Показано {visibleProducts.length} из {filteredProducts.length} товаров
                    {activeCategory !== 'Все' && ` в категории "${activeCategory}"`}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}