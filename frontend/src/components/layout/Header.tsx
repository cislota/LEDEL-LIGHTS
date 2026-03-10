// src/components/layout/Header.tsx
'use client';

import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  
  const handleLogoClick = () => {
    if (pathname === '/') {
      window.scroll({ top: 0, behavior: 'smooth'}); //если страница на главной - скролл вверх
    } else {
      router.push('/'); // переход на главную, скролл
      setTimeout (() => {
        window.scrollTo ({top: 0, behavior: 'smooth'}); // дилей прогрузки для домена
      }, 100)
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({behavior: 'smooth'});
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Логотип */}
        <Link href="/" aria-label="На главную">
          <Image
            src="/media/logo_2.svg"
            alt="LEDL Lights"
            width={160}
            height={32}
            className="max-w-[160px] h-auto"
          />
        </Link>

        {/* Меню — с прокруткой к секциям */}
        <nav className="hidden md:flex space-x-8">
          {[
            { label: 'Отрасли', id: 'target-audience' },
            { label: 'Каталог', id: 'catalog' },
            { label: 'Индивидуальное КП', id: 'contact-manager' },
            { label: 'Проекты', id: 'projects' },
            { label: 'Отзывы', id: 'testimonials' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-gray-700 hover:text-blue-600 transition"
              style={{ fontSize: '13px', fontFamily: 'Arial, sans-serif' }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Наименование и контакты */}
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
            href="https://wa.me/79215724713"
            target="_blank"
            rel="noopener noreferrer"
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
            href="tel:+78003510975"
            className="font-medium text-gray-800 hover:text-red-600 transition"
            style={{ fontSize: '13px', fontFamily: 'Arial, sans-serif' }}
          >
            8 (800) 351-09-75
          </a>
        </div>
      </div>
    </header>
  );
}