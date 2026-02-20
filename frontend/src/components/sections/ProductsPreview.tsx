// src/components/sections/ProductsPreview.tsx
// Позже данные будут приходить из API, сейчас — заглушка
const mockProducts = [
  { id: 1, name: 'Уличный светильник', image: '/media/kfc2.jpg' },
  { id: 2, name: 'Промышленный LED', image: '/media/1ulichnoe-1024x575.jpg' },
  { id: 3, name: 'Офисное освещение', image: '/media/img_7692.jpg' },
  { id: 4, name: 'Светильник для ТРК', image: '/media/trekovyi-belyi.png' },
  { id: 5, name: 'Точечный свет', image: '/media/_.jpg' },
  { id: 6, name: 'Линейный модуль', image: '/media/photo.jpg' },
];

export default function ProductsPreview() {
  return (
    <section id="catalog" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Популярные товары</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
                width={400}
                height={200}
              />
              <div className="p-4">
                <h3 className="font-semibold">{product.name}</h3>
                <button className="mt-2 text-blue-600 text-sm hover:underline">
                  Подробнее →
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a
            href="/katalog"
            className="inline-block px-6 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
          >
            Смотреть весь каталог
          </a>
        </div>
      </div>
    </section>
  );
}