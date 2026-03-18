// src/utils/product-helpers.ts
import { ReactNode } from 'react';

/** Сырой ответ от Tilda API для одного товара */
export interface TildaProductRaw {
  id?: number;
  uid: string;
  title?: string;
  text?: string;
  price?: {
    display?: string;
    value?: number;
  };
  images?: Array<{
    url?: string;
    alt?: string;
  }>;
  img?: string; // Альтернативное поле изображения
  sku?: string;
  [key: string]: any; // Для остальных полей Tilda
}

/** Ответ API-роута Next.js */
export interface TildaApiResponse {
  products?: TildaProductRaw[];
  [key: string]: any;
}

/** Внутренний тип продукта для использования в компонентах */
export interface Product {
  id: number;
  uid: string;
  img: string;
  nameMain: string;
  nameSpec: string;
  type: string;
  category: string;
  price?: string;
  text?: string;
  sku?: string;
}

// Категории

export const CATEGORIES = {
  ALL: 'Все',
  INDUSTRIAL: 'Промышленное освещение',
  STREET: 'Уличное освещение',
  OFFICE: 'Офисное освещение',
  COMMERCIAL: 'Коммерческое освещение',
  ARCHITECTURAL: 'Архитектурно-парковое освещение',
} as const;

export type CategoryKey = keyof typeof CATEGORIES;
export type CategoryValue = typeof CATEGORIES[CategoryKey];

//  Хелпер-функции


/**
 * Разбивает заголовок товара на основную часть и спецификацию
 * @param title - Полный заголовок из Tilda (напр. "L-street Pro / 50W / IP65")
 * @returns Объект с nameMain и nameSpec
 */
export function parseProductTitle(title: string | undefined): { nameMain: string; nameSpec: string } {
  if (!title) {
    return { nameMain: 'Светильник', nameSpec: '' };
  }
  
  const parts = title.split('/');
  const nameMain = parts[0]?.trim() || 'Светильник';
  const nameSpec = parts.slice(1).join('/').trim();
  
  return { nameMain, nameSpec };
}

/**
 * Определяет категорию товара по основной части названия
 * @param nameMain - Основная часть названия (до первого "/")
 * @returns Категория из CATEGORIES
 */
export function categorizeProduct(nameMain: string): CategoryValue {
  if (!nameMain) return CATEGORIES.INDUSTRIAL;
  
  if (nameMain.includes('L-street')) {
    return CATEGORIES.STREET;
  }
  if (nameMain.includes('L-office') || nameMain.includes('L-fusion Office')) {
    return CATEGORIES.OFFICE;
  }
  if (nameMain.includes('L-fusion Retail')) {
    return CATEGORIES.COMMERCIAL;
  }
  if (nameMain.includes('L-contour') || nameMain.includes('L-facade')) {
    return CATEGORIES.ARCHITECTURAL;
  }
  
  return CATEGORIES.INDUSTRIAL;
}

/**
 * Определяет тип изделия на основе категории
 */
export function getProductType(category: CategoryValue): string {
  return category === CATEGORIES.INDUSTRIAL ? 'Прожектор' : 'Светильник';
}

/**
 * Получает URL изображения с приоритетом: реальные фото из API → заглушка по категории
 * @param rawProduct - Сырой продукт из Tilda API
 * @param category - Категория товара для выбора заглушки
 * @param fallbackPrefix - Префикс пути к заглушкам (по умолчанию '/media/')
 */
export function getProductImage(
  rawProduct: TildaProductRaw,
  category: CategoryValue,
  fallbackPrefix: string = '/media/'
): string {
  // Приоритет 1: images[0].url из API
  if (rawProduct.images?.[0]?.url) {
    return rawProduct.images[0].url;
  }
  
  // Приоритет 2: поле img (если данные уже обработаны)
  if (rawProduct.img) {
    return rawProduct.img;
  }
  
  // Приоритет 3: заглушка по категории
  const fallbacks: Record<CategoryValue, string> = {
    [CATEGORIES.ALL]: `${fallbackPrefix}prom.webp`,
    [CATEGORIES.INDUSTRIAL]: `${fallbackPrefix}prom.webp`,
    [CATEGORIES.STREET]: `${fallbackPrefix}ul.webp`,
    [CATEGORIES.OFFICE]: `${fallbackPrefix}of.webp`,
    [CATEGORIES.COMMERCIAL]: `${fallbackPrefix}kom.webp`,
    [CATEGORIES.ARCHITECTURAL]: `${fallbackPrefix}arch.webp`,
  };
  
  return fallbacks[category] || fallbacks[CATEGORIES.INDUSTRIAL];
}

/**
 * Форматирует сырой продукт Tilda во внутренний формат Product
 * @param raw - Сырой продукт из API
 * @param index - Индекс для генерации id (если нет в API)
 * @param fallbackPrefix - Префикс для заглушек изображений
 */
export function formatProduct(
  raw: TildaProductRaw,
  index: number,
  fallbackPrefix: string = '/media/'
): Product {
  const { nameMain, nameSpec } = parseProductTitle(raw.title);
  const category = categorizeProduct(nameMain);
  
  return {
    id: raw.id || index + 1,
    uid: raw.uid,
    img: getProductImage(raw, category, fallbackPrefix),
    nameMain,
    nameSpec,
    type: getProductType(category),
    category,
    price: raw.price?.display,
    text: raw.text,
    sku: raw.sku,
  };
}

/**
 * Извлекает массив продуктов из ответа API (универсальный парсер)
 */
export function extractProductsFromResponse(data: any): TildaProductRaw[] {
  if (Array.isArray(data)) return data;
  if (data?.products && Array.isArray(data.products)) return data.products;
  return [];
}

/**
 * Фильтрует товары: оставляет только те, что содержат "Светильник" в названии
 */
export function filterLightingProducts(products: TildaProductRaw[]): TildaProductRaw[] {
  return products.filter((p) => p.title?.includes('Светильник'));
}

/**
 * Получает уникальные категории из массива продуктов
 */
export function getUniqueCategories(products: Product[]): CategoryValue[] {
  const unique = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  return [CATEGORIES.ALL, ...unique] as CategoryValue[];
}


//  UI-хелперы


/**
 * Умно разбивает длинное название на 2-3 строки для отображения
 * @returns ReactNode с <br /> тегами при необходимости
 */
export function splitProductName(text: string): ReactNode {
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
}