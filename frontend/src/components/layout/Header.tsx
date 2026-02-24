// src/components/layout/Header.tsx
import Image from 'next/image';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Логотип */}
        <Image
          src="/media/logo_2.svg"
          alt="LEDL Lights"
          width={160}
          height={32}
          className="max-w-[160px] h-auto"
        />

        {/* Меню */}
        <nav className="hidden md:flex space-x-8">
          {['Отрасли', 'Каталог', 'Индивидуальное КП', 'Проекты', 'Отзывы'].map((item) => (
            <a
              key={item}
              href={`/${item.toLowerCase().replace(' ', '-')}`}
              className="text-gray-700 hover:text-blue-600 transition"
              style={{ fontSize: '13px', fontFamily: 'Arial, sans-serif' }}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Наименование */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="hidden md:block" style={{ fontSize: '13px', fontFamily: 'Arial, sans-serif' }}>
            ГК «СветКонсалт» — официальный
            <br />
            дилер завода-изготовителя Ledel
          </span>

          {/* Почта */}
          <a href="mailto:info@ledl-lights.ru" aria-label="Email" className="text-gray-500 hover:text-red-600 transition">
            <Image
              src="/media/mail-icon.svg"
              alt="Email"
              width={24}
              height={24}
              className="inline-block"
            />
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/78126658473"
            aria-label="WhatsApp"
            className="text-gray-500 hover:text-green-600 transition"
          >
            <Image
              src="/media/whatsapp-icon.svg"
              alt="WhatsApp"
              width={24}
              height={24}
              className="inline-block"
            />
          </a>

          {/* Телефон */}
          <a
            href="tel:+78126658473"
            className="font-medium text-gray-800 hover:text-red-600 transition"
            style={{ fontSize: '13px', fontFamily: 'Arial, sans-serif' }}
          >
            8 (812) 665-84-73
          </a>
        </div>
      </div>
    </header>
  );
}