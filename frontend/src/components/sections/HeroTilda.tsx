// src/components/sections/HeroTilda.tsx
import Image from 'next/image';

export default function HeroTilda() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
          {/* Текстовый блок */}
          <div className="flex-1 max-w-xl text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              <span className="whitespace-nowrap">Скачайте актуальный</span><br />
              <span className="whitespace-nowrap">прайс-лист завода <span className="text-red-600">LEDEL</span></span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              с экономией на ценах до 30% среди конкурентов
            </p>
            <div className="flex justify-center lg:justify-start">
              <button className="w-full max-w-md px-16 py-4 bg-red-600 text-white font-medium rounded-[35px] hover:bg-red-700 transition shadow-md">
                Получить оптовый прайс-лист
              </button>
            </div>
          </div>

          {/* Изображение брошюры */}
          <div className="flex-1 flex justify-center">
            <Image
              src="/media/Magazine.png (1).webp"
              alt="Открытая брошюра с логотипом LEDEL"
              width={562}
              height={386}
              className="max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}