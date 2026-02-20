// src/components/sections/HeroTilda.tsx
import Image from 'next/image';

export default function HeroTilda() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Текстовый блок */}
          <div className="flex-1 max-w-2xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Скачайте актуальный<br />
              прайс-лист завода <span className="text-red-600">LEDEL</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              с экономией на ценах до 30% среди конкурентов
            </p>
            <button className="px-8 py-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition shadow-md">
              Получить оптовый прайс-лист
            </button>
          </div>

          {/* Изображение брошюры */}
          <div className="flex-1 flex justify-center">
            <Image
              src="/media/Magazine.png (1).webp" // ← замените на реальное имя файла из вашей папки media/
              alt="Открытая брошюра с логотипом LEDEL"
              width={500}
              height={300}
              className="max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}