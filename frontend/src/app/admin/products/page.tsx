'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import { api } from '@/lib/api';
import { Product } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterAvailable, setFilterAvailable] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    loadProducts();
  }, [page, filterCategory, filterAvailable]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params: any = { page, page_size: pageSize };
      if (filterCategory !== 'all') {
        params.category = filterCategory;
      }
      if (filterAvailable === 'available') {
        params.is_available = true;
      } else if (filterAvailable === 'unavailable') {
        params.is_available = false;
      }
      if (search) {
        params.search = search;
      }
      const res = await api.products.list(params);
      const data = res.data.data;
      setProducts(data.items || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { 
      key: 'image_url', 
      label: 'Фото',
      render: (product: Product) => (
        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
          {product.image_url ? (
            <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">📷</div>
          )}
        </div>
      )
    },
    { 
      key: 'title', 
      label: 'Название',
      render: (product: Product) => (
        <div>
          <div className="font-medium">{product.title}</div>
          {product.article && <div className="text-sm text-gray-500">Арт. {product.article}</div>}
        </div>
      )
    },
    { 
      key: 'price', 
      label: 'Цена',
      render: (product: Product) => product.price ? `${product.price} ₽` : '—'
    },
    { 
      key: 'category', 
      label: 'Категория',
      render: (product: Product) => product.category || '—'
    },
    { 
      key: 'brand', 
      label: 'Бренд',
      render: (product: Product) => product.brand || '—'
    },
    { 
      key: 'is_available', 
      label: 'Доступность',
      render: (product: Product) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          product.is_available
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {product.is_available ? 'В наличии' : 'Нет'}
        </span>
      )
    },
  ];

  const totalPages = Math.ceil(total / pageSize);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Товары</h1>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Поиск..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadProducts()}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Все категории</option>
              {/* Категории можно загрузить динамически */}
            </select>
            <select
              value={filterAvailable}
              onChange={(e) => {
                setFilterAvailable(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Все</option>
              <option value="available">В наличии</option>
              <option value="unavailable">Нет в наличии</option>
            </select>
            <button
              onClick={loadProducts}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Поиск
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Загрузка...</div>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={products}
              onRowClick={setSelectedProduct}
              emptyMessage="Нет товаров"
            />

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Показано {products.length} из {total}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Назад
                </button>
                <span className="px-4 py-2 text-gray-500">
                  Страница {page} из {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Вперед
                </button>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
              💡 Для редактирования товаров используйте <a href="/admin" className="underline font-medium">SQLAdmin панель</a>
            </div>
          </>
        )}

        {/* Product Detail Modal */}
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
}

function ProductDetailModal({ 
  product, 
  onClose 
}: { 
  product: Product; 
  onClose: () => void;
}) {
  const parseSpecs = () => {
    try {
      return JSON.parse(product.specs || '{}');
    } catch {
      return {};
    }
  };

  const specs = parseSpecs();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-xl font-bold">{product.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Image */}
          {product.image_url && (
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Артикул</div>
              <div className="font-medium">{product.article || '—'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Бренд</div>
              <div className="font-medium">{product.brand || '—'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Цена</div>
              <div className="font-medium">{product.price ? `${product.price} ₽` : '—'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Категория</div>
              <div className="font-medium">{product.category || '—'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Тип</div>
              <div className="font-medium">{product.type || '—'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Доступность</div>
              <div className="font-medium">
                <span className={product.is_available ? 'text-green-600' : 'text-red-600'}>
                  {product.is_available ? 'В наличии' : 'Нет в наличии'}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Краткое описание</div>
              <div className="p-3 bg-gray-50 rounded-lg">{product.description}</div>
            </div>
          )}

          {/* Full Text */}
          {product.text && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Полное описание</div>
              <div className="p-3 bg-gray-50 rounded-lg whitespace-pre-wrap">{product.text}</div>
            </div>
          )}

          {/* Specs */}
          {Object.keys(specs).length > 0 && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Характеристики</div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(specs, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Meta Info */}
          <div className="pt-4 border-t border-gray-200 grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div>
              Создан: {new Date(product.created_at).toLocaleString('ru-RU')}
            </div>
            <div>
              Обновлен: {new Date(product.updated_at).toLocaleString('ru-RU')}
            </div>
          </div>

          {/* Edit Link */}
          <div className="pt-4 border-t border-gray-200">
            <a
              href="/admin"
              target="_blank"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Редактировать в SQLAdmin →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
