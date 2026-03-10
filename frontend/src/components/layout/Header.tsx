// src/components/layout/Header.tsx
'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogoClick = () => {
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const menuItems = [
    { label: 'Отрасли', id: 'target-audience' },
    { label: 'Каталог', id: 'catalog' },
    { label: 'Индивидуальное КП', id: 'contact-manager' },
    { label: 'Проекты', id: 'projects' },
    { label: 'Отзывы', id: 'testimonials' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Логотип */}
        <button
          type="button"
          aria-label="На главную"
          className="cursor-pointer"
          onClick={handleLogoClick}
        >
          <img
            src="/media/logo_2.svg"
            alt="LEDEL Lights"
            style={{
              maxWidth: '100px',
              width: '100px',
              minWidth: '100px',
              height: 'auto',
              display: 'block',
            }}
          />
        </button>

        {/* Плашка меню на мобильных */}
        <button
          className="md:hidden flex flex-col items-end w-7 h-5"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Открыть меню"
          aria-expanded={isMenuOpen}
        >
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className={`block w-full h-0.5 bg-[#d5302c] transition-all duration-300 ${
                isMenuOpen
                  ? i === 0 || i === 3
                    ? 'opacity-0'
                    : i === 1
                    ? 'rotate-45 translate-y-0.5'
                    : '-rotate-45 -translate-y-0.5'
                  : ''
              }`}
            />
          ))}
        </button>

        {/* Десктопное меню + контакты */}
        <div className="hidden md:flex items-center gap-8">
          {/* Меню */}
          <nav>
            <ul className="flex list-none m-0 p-0">
              {menuItems.map((item, index) => (
                <li
                  key={item.id}
                  style={{
                    padding:
                      index === 0
                        ? '0 40px 0 0'
                        : index === menuItems.length - 1
                        ? '0 0 0 40px'
                        : '0 40px',
                  }}
                >
                  <a
                    href={`/#${item.id}`}
                    className="font-bold text-gray-700 hover:text-[#d5302c] transition-colors no-underline"
                    style={{
                      fontSize: '13px',
                      fontFamily: '"TildaSans", Arial, sans-serif',
                      display: 'block',
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.id);
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Контакты */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span style={{ fontSize: '13px', fontFamily: '"TildaSans", Arial, sans-serif' }}>
              ГК «СветКонсалт» — официальный
              <br />
              дилер завода-изготовителя Ledel
            </span>

            <a
              href="mailto:info@ledl-lights.ru"
              aria-label="Email"
              className="text-gray-500 hover:text-[#d5302c] transition"
              style={{ width: '30px', height: '30px' }}
            >
              <svg role="presentation" width="30" height="30" viewBox="0 0 100 100" fill="#d5302c" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0C22.3858 0 0 22.3858 0 50C0 77.6142 22.3858 100 50 100ZM51.8276 49.2076L74.191 33.6901C73.4347 32.6649 72.2183 32 70.8466 32H29.1534C27.8336 32 26.6576 32.6156 25.8968 33.5752L47.5881 49.172C48.8512 50.0802 50.5494 50.0945 51.8276 49.2076ZM75 63.6709V37.6286L53.4668 52.57C51.1883 54.151 48.1611 54.1256 45.9095 52.5066L25 37.4719V63.6709C25 65.9648 26.8595 67.8243 29.1534 67.8243H70.8466C73.1405 67.8243 75 65.9648 75 63.6709Z" />
              </svg>
            </a>

            <a
              href="https://wa.me/79215724713"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-gray-500 hover:text-green-600 transition"
              style={{ width: '30px', height: '30px' }}
            >
              <svg role="presentation" width="30" height="30" viewBox="0 0 100 100" fill="#d5302c" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0C22.3858 0 0 22.3858 0 50C0 77.6142 22.3858 100 50 100ZM69.7626 28.9928C64.6172 23.841 57.7739 21.0027 50.4832 21C35.4616 21 23.2346 33.2252 23.2292 48.2522C23.2274 53.0557 24.4823 57.7446 26.8668 61.8769L23 76L37.4477 72.2105C41.4282 74.3822 45.9107 75.5262 50.4714 75.528H50.4823C65.5029 75.528 77.7299 63.301 77.7363 48.2749C77.7408 40.9915 74.9089 34.1446 69.7626 28.9928ZM62.9086 53.9588C62.2274 53.6178 58.8799 51.9708 58.2551 51.7435C57.6313 51.5161 57.1766 51.4024 56.7228 52.0845C56.269 52.7666 54.964 54.2998 54.5666 54.7545C54.1692 55.2092 53.7718 55.2656 53.0915 54.9246C52.9802 54.8688 52.8283 54.803 52.6409 54.7217C51.6819 54.3057 49.7905 53.4855 47.6151 51.5443C45.5907 49.7382 44.2239 47.5084 43.8265 46.8272C43.4291 46.1452 43.7837 45.7769 44.1248 45.4376C44.3292 45.2338 44.564 44.9478 44.7987 44.662C44.9157 44.5194 45.0328 44.3768 45.146 44.2445C45.4345 43.9075 45.56 43.6516 45.7302 43.3049C45.7607 43.2427 45.7926 43.1776 45.8272 43.1087C46.0545 42.654 45.9409 42.2565 45.7708 41.9155C45.6572 41.6877 45.0118 40.1167 44.4265 38.6923C44.1355 37.984 43.8594 37.3119 43.671 36.8592C43.1828 35.687 42.6883 35.69 42.2913 35.6924C42.2386 35.6928 42.1876 35.6931 42.1386 35.6906C41.7421 35.6706 41.2874 35.667 40.8336 35.667C40.3798 35.667 39.6423 35.837 39.0175 36.5191C38.9773 36.5631 38.9323 36.6111 38.8834 36.6633C38.1738 37.4209 36.634 39.0648 36.634 42.2002C36.634 45.544 39.062 48.7748 39.4124 49.2411L39.415 49.2444C39.4371 49.274 39.4767 49.3309 39.5333 49.4121C40.3462 50.5782 44.6615 56.7691 51.0481 59.5271C52.6732 60.2291 53.9409 60.6475 54.9303 60.9612C56.5618 61.4796 58.046 61.4068 59.22 61.2313C60.5286 61.0358 63.2487 59.5844 63.8161 57.9938C64.3836 56.4033 64.3836 55.0392 64.2136 54.7554C64.0764 54.5258 63.7545 54.3701 63.2776 54.1395C63.1633 54.0843 63.0401 54.0247 62.9086 53.9588Z" />
              </svg>
            </a>

            <a
              href="tel:+78003510975"
              className="font-bold text-gray-800 no-underline"
              style={{
                fontSize: '14px',
                fontFamily: '"TildaSans", Arial, sans-serif',
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                padding: '6px 16px',
              }}
            >
              8 (800) 351-09-75
            </a>
          </div>
        </div>
      </div>

      {/* Мобильное меню */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-40 pt-6 pb-8 px-6 overflow-y-auto">
          <div className="mb-8">
            <img
              src="/media/logo_2.svg"
              alt="LEDEL Lights"
              style={{ maxWidth: '100px', width: '100px', height: 'auto' }}
            />
          </div>

          <div className="flex flex-col space-y-5 mb-8">
            {menuItems.map((item) => (
              <a
                key={item.id}
                href={`/#${item.id}`}
                className="font-bold text-gray-700 hover:text-[#d5302c] text-lg"
                style={{ fontFamily: '"TildaSans", Arial, sans-serif' }}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.id);
                }}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-gray-600 mb-3" style={{ fontFamily: '"TildaSans", Arial, sans-serif' }}>
              ГК «СветКонсалт» — официальный дилер завода-изготовителя Ledel
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:info@ledl-lights.ru"
                className="text-[#d5302c] font-medium"
                style={{ fontFamily: '"TildaSans", Arial, sans-serif' }}
              >
                Email: info@ledl-lights.ru
              </a>
              <a
                href="https://wa.me/79215724713"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 font-medium"
                style={{ fontFamily: '"TildaSans", Arial, sans-serif' }}
              >
                WhatsApp
              </a>
              <a
                href="tel:+78003510975"
                className="text-gray-800 font-bold"
                style={{ fontFamily: '"TildaSans", Arial, sans-serif' }}
              >
                8 (800) 351-09-75
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}