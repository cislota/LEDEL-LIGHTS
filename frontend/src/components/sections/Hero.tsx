// src/components/sections/Hero.tsx
export default function Hero() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
          Светодиодное освещение для вашего дома и бизнеса
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Энергоэффективные решения с гарантией до 5 лет. Более 1000 довольных клиентов по России.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="#catalog"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Посмотреть каталог
          </a>
          <a
            href="tel:+78126658473"
            className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            Заказать звонок
          </a>
        </div>
      </div>
    </section>
  );
}