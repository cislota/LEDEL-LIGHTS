// src/components/sections/CatalogSection.tsx
'use client';

import { useState, useMemo, useEffect, ReactNode } from 'react'; // ✅ Добавлен ReactNode
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: number;
  uid: string;
  img: string;
  nameMain: string;
  nameSpec: string;
  type: string;
  category: string;
  price?: string;
}

// ✅ Фикс #1: Явный тип возврата ReactNode
const splitProductName = (text: string): ReactNode => {
  const words = text.split(' ');
  
  if (words.length <= 3) {
    return text;
  }
  
  if (words.length <= 6) {
    const firstPart = words.slice(0, 3).join(' ');
    const secondPart = words.slice(3).join(' ');
    return (
      <>
        {firstPart}
        <br />
        {secondPart}
      </>
    );
  }
  
  const thirdIndex = Math.ceil(words.length / 3);
  const sixthIndex = Math.ceil((words.length * 2) / 3);
  
  const firstPart = words.slice(0, thirdIndex).join(' ');
  const secondPart = words.slice(thirdIndex, sixthIndex).join(' ');
  const thirdPart = words.slice(sixthIndex).join(' ');
  
  return (
    <>
      {firstPart}
      <br />
      {secondPart}
      <br />
      {thirdPart}
    </>
  );
};

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

        const productsData = data.products || [];
        console.log('📦 Продуктов найдено:', productsData.length);

        const formattedProducts: Product[] = productsData
          .filter((p: any) => {
            return p.title && p.title.includes('Светильник');
          })
          .map((p: any, index: number) => {
            const titleParts = p.title.split('/');
            const nameMain = titleParts[0];
            const nameSpec = titleParts.slice(1).join('/');
            
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

            // ✅ Фикс #2: Приоритет реального изображения из API
            let imgUrl = '/media/prom.webp';
            if (p.images?.[0]?.url) {
              imgUrl = p.images[0].url;
            } else if (p.img) {
              imgUrl = p.img;
            } else if (category === 'Уличное освещение') {
              imgUrl = '/media/ul.webp';
            } else if (category === 'Офисное освещение') {
              imgUrl = '/media/of.webp';
            } else if (category === 'Коммерческое освещение') {
              imgUrl = '/media/kom.webp';
            } else if (category === 'Архитектурно-парковое освещение') {
              imgUrl = '/media/arch.webp';
            }

            return {
              id: index + 1,
              uid: p.uid,
              img: imgUrl,
              nameMain: nameMain.trim(),
              nameSpec: nameSpec.trim(),
              type: category === 'Промышленное освещение' ? 'Прожектор' : 'Светильник',
              category: category,
              price: '',
            };
          });

        console.log('✅ Отформатировано товаров:', formattedProducts.length);
        if (formattedProducts.length > 0) {
          console.log('📋 Пример первого товара:', formattedProducts[0]);
        }
        
        setProducts(formattedProducts);

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

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'Все') {
      return products;
    }
    return products.filter((p) => p.category === activeCategory);
  }, [activeCategory, products]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(9);
  }, [activeCategory]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 9);
  };

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
        {/* Заголовок и подзаголовок без изменений */}
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

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Левое меню */}
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
                    <Link
                      // ✅ Фикс #3: Надёжный ключ с фолбэком
                      key={`${product.uid}-${product.id}`}
                      href={`/product/${product.uid}`}
                      className="block hover:opacity-90 transition"
                    >
                      <div
                        className="flex flex-col"
                        style={{ width: '279px', height: '320px' }}
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
                            // ✅ Фикс #4: Убран некорректный priority
                          />
                        </div>

                        <div
                          className="flex flex-col"
                          style={{
                            width: '279px',
                            height: '188px',
                            gap: '4px',
                          }}
                        >
                          <div
                            className="flex flex-col justify-center"
                            style={{
                              width: '279px',
                              minHeight: '60px',
                              textAlign: 'center',
                            }}
                          >
                            <h3
                              style={{
                                fontSize: '18px',
                                fontFamily: '"TildaSans", Arial, sans-serif',
                                color: '#000000',
                                fontWeight: 600,
                                lineHeight: 1.3,
                                margin: 0,
                              }}
                            >
                              {splitProductName(product.nameMain)}
                            </h3>
                          </div>

                          <div
                            style={{
                              fontSize: '18px',
                              fontFamily: '"TildaSans", Arial, sans-serif',
                              color: '#000000',
                              fontWeight: 600,
                              lineHeight: 1.3,
                              marginTop: '2px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              textAlign: 'center',
                            }}
                          >
                            {product.nameSpec}
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
                    </Link>
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