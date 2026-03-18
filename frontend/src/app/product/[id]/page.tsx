// app/product/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

interface Product {
  id: number;
  uid: string;
  img: string;
  nameMain: string;
  nameSpec: string;
  type: string;
  category: string;
  text?: string;
  sku?: string;
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  // ✅ Фикс #1: Добавлено состояние ошибки
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/tilda-products');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        const productsData = Array.isArray(data) ? data : (data.products || []);
        
        // ✅ Фикс #2: Безопасное получение id
        const productId = Array.isArray(params.id) ? params.id[0] : params.id;
        
        const foundProduct = productsData.find(
          (p: any) => p.uid === productId
        );

        if (foundProduct) {
          const nameParts = foundProduct.title?.split('/') || [];
          const nameMain = nameParts[0] || 'Светильник';
          const nameSpec = nameParts.slice(1).join('/') || '';
          
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

          // ✅ Фикс #3: Приоритет реального изображения
          let imgUrl = '/media/prom.webp';
          if (foundProduct.images?.[0]?.url) {
            imgUrl = foundProduct.images[0].url;
          } else if (foundProduct.img) {
            imgUrl = foundProduct.img;
          } else if (category === 'Уличное освещение') {
            imgUrl = '/media/ul.webp';
          } else if (category === 'Офисное освещение') {
            imgUrl = '/media/of.webp';
          } else if (category === 'Коммерческое освещение') {
            imgUrl = '/media/kom.webp';
          } else if (category === 'Архитектурно-парковое освещение') {
            imgUrl = '/media/arch.webp';
          }

          setProduct({
            id: foundProduct.id || 0,
            uid: foundProduct.uid,
            img: imgUrl,
            nameMain: nameMain.trim(),
            nameSpec: nameSpec.trim(),
            type: category === 'Промышленное освещение' ? 'Прожектор' : 'Светильник',
            category: category,
            text: foundProduct.text || '',
            sku: foundProduct.sku || '',
          });
        } else {
          setError('Товар не найден');
        }
      } catch (err) {
        console.error('Ошибка загрузки товара:', err);
        // ✅ Фикс #1: Установка сообщения об ошибке
        setError(`Не удалось загрузить товар: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  // ✅ Фикс #1: Обработка состояния ошибки
  if (error) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <p className="text-red-600 text-xl mb-4">❌ {error}</p>
            <button
              onClick={() => router.push('/')}
              className="px-8 py-3 bg-[#d5302c] text-white rounded-full hover:bg-[#b52824] transition"
              style={{ fontFamily: '"TildaSans", Arial, sans-serif' }}
            >
              Вернуться на главную
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#d5302c]"></div>
          </div>
        </div>
      </div>
    );
  }

  // Товар не найден
  if (!product) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: '"TildaSans", Arial, sans-serif' }}>
              Товар не найден
            </h1>
            <button
              onClick={() => router.push('/')}
              className="px-8 py-3 bg-[#d5302c] text-white rounded-full hover:bg-[#b52824] transition"
              style={{ fontFamily: '"TildaSans", Arial, sans-serif' }}
            >
              Вернуться в каталог
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Кнопка назад */}
        <button
          onClick={() => router.back()}
          className="mb-8 text-[#d5302c] hover:text-[#b52824] transition flex items-center gap-2"
          style={{ fontFamily: '"TildaSans", Arial, sans-serif' }}
        >
          ← Назад в каталог
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Изображение товара */}
          <div className="flex items-center justify-center bg-gray-50 rounded-2xl p-8">
            <Image
              src={product.img}
              alt={product.nameMain}
              width={600}
              height={600}
              className="object-contain max-h-[600px]"
              priority
            />
          </div>

          {/* Информация о товаре */}
          <div className="flex flex-col">
            <h1
              className="text-3xl font-bold mb-4"
              style={{ fontFamily: '"TildaSans", Arial, sans-serif' }}
            >
              {product.nameMain}
            </h1>

            {product.nameSpec && (
              <p
                className="text-xl text-gray-700 mb-6"
                style={{ fontFamily: '"TildaSans", Arial, sans-serif' }}
              >
                {product.nameSpec}
              </p>
            )}

            {product.type && (
              <p
                className="text-gray-600 mb-8"
                style={{ fontFamily: '"TildaSans", Arial, sans-serif' }}
              >
                Тип: {product.type}
              </p>
            )}

            {/* Кнопка запросить прайс */}
            <button
              className="w-full sm:w-auto px-12 py-4 bg-[#d5302c] text-white font-bold rounded-[30px] hover:bg-[#b52824] transition mb-8"
              style={{
                fontSize: '16px',
                fontFamily: '"TildaSans", Arial, sans-serif',
              }}
            >
              ЗАПРОСИТЬ ПРАЙС
            </button>

            {/* Описание */}
            {product.text && (
              <div
                className="bg-gray-50 rounded-2xl p-6"
                style={{ fontFamily: '"TildaSans", Arial, sans-serif' }}
              >
                <h2 className="text-xl font-bold mb-4">Описание</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {product.text}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}