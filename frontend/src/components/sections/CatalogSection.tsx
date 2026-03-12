// src/components/sections/CatalogSection.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';

export default function CatalogSection() {
  const [activeCategory, setActiveCategory] = useState('Все');
  const [visibleCount, setVisibleCount] = useState(9); // Изначально 9 товаров

  const products = [
  
  // ПРОМЫШЛЕННОЕ ОСВЕЩЕНИЕ (19 товаров) /media/prom.webp

  {
    id: 1,
    img: '/media/prom.webp',
    nameMain: 'Светильник L-banner ',
    nameSpec: '600/600/Г30/5,0K/04/220AC IP66',
    type: 'Прожектор',
    category: 'Промышленное освещение',
  },
  {
    id: 2,
    img: '/media/prom.webp',
    nameMain: 'Светильник L-banner ',
    nameSpec: '600/600/Г60/4,0K/04/220AC IP66',
    type: 'Прожектор',
    category: 'Промышленное освещение',
  },
  {
    id: 3,
    img: '/media/prom.webp',
    nameMain: 'Светильник L-banner ',
    nameSpec: '600/600/Г30/4,0K/04/220AC IP66',
    type: 'Прожектор',
    category: 'Промышленное освещение',
  },
  {
    id: 4,
    img: '/media/prom.webp',
    nameMain: 'Светильник L-banner ',
    nameSpec: '600/600/К15/5,7K/04/220AC IP66 Sport',
    type: 'Прожектор',
    category: 'Промышленное освещение',
  },
  {
    id: 5,
    img: '/media/prom.webp',
    nameMain: 'Светильник L-banner ',
    nameSpec: '600/600/К15/5,0K/04/220AC IP66',
    type: 'Прожектор',
    category: 'Промышленное освещение',
  },
  {
    id: 6,
    img: '/media/prom.webp',
    nameMain: 'Светильник L-banner ',
    nameSpec: '600/600/К8/5,0K/04/220AC IP66',
    type: 'Прожектор',
    category: 'Промышленное освещение',
  },
  {
    id: 7,
    img: '/media/prom.webp',
    nameMain: 'Светильник L-banner ',
    nameSpec: '600/600/Г60/5,0K/04/220AC IP66',
    type: 'Прожектор',
    category: 'Промышленное освещение',
  },
  {
    id: 8,
    img: '/media/prom.webp',
    nameMain: 'Светильник L-banner ',
    nameSpec: '600/600/К15/4,0K/04/220AC IP66',
    type: 'Прожектор',
    category: 'Промышленное освещение',
  },
  {
    id: 9,
    img: '/media/prom.webp',
    nameMain: 'Светильник L-banner ',
    nameSpec: '600/600/Г60/5,7K/04/220AC IP66 Sport',
    type: 'Прожектор',
    category: 'Промышленное освещение',
  },
  {
    id: 10,
    img: '/media/prom.webp',
    nameMain: 'Светильник L-banner ',
    nameSpec: '600/620/Г30/5,7K/04/220AC IP66 Sport',
    type: 'Прожектор',
    category: 'Промышленное освещение',
  },
  {
    id: 11,
    img: '/media/prom.webp',
    nameMain: 'Светильник L-industry ',
    nameSpec: '120 Turbine/Em/100/К15/750/01/IKV-24/230AC IP66',
    type: 'Прожектор',
    category: 'Промышленное освещение',
  },
  {
    id: 12,
    img: '/media/prom.webp',
    nameMain: 'Светильник L-industry ',
    nameSpec: '120 Turbine/Em/100/Г30/740/01/IKV-24/230AC IP66',
    type: 'Прожектор',
    category: 'Промышленное освещение',
  },
  {
    id: 13,
    img: '/media/prom.webp',
    nameMain: 'Светильник L-industry ',
    nameSpec: '120 Turbine/Em/100/Г30/750/01/IKV-24/230AC IP66',
    type: 'Прожектор',
    category: 'Промышленное освещение',
  },
  {
    id: 14,
    img: '/media/prom.webp',
    nameMain: 'Светильник L-industry ',
    nameSpec: '120 Turbine/Em/100/К15/740/01/IKV-24/230AC IP66',
    type: 'Прожектор',
    category: 'Промышленное освещение',
  },
  {
    id: 15,
    img: '/media/prom.webp',
    nameMain: 'Светильник L-industry ',
    nameSpec: '120 Turbine/Em/100/Д/850/01/IKV-24/230AC IP66',
    type: 'Прожектор',
    category: 'Промышленное освещение',
  },
  {
    id: 16,
    img: '/media/prom.webp',
    nameMain: 'Светильник L-industry ',
    nameSpec: '120 Turbine/Em/100/Г60/750/01/IKV-24/230AC IP66',
    type: 'Прожектор',
    category: 'Промышленное освещение',
  },
  {
    id: 17,
    img: '/media/prom.webp',
    nameMain: 'Светильник L-industry ',
    nameSpec: '120 Turbine/Em/100/Г60/740/01/IKV-24/230AC IP66',
    type: 'Прожектор',
    category: 'Промышленное освещение',
  },
  {
    id: 18,
    img: '/media/prom.webp',
    nameMain: 'Светильник L-industry ',
    nameSpec: '120 Turbine/Em/100/Д/840/01/IKV-24/230AC IP66',
    type: 'Прожектор',
    category: 'Промышленное освещение',
  },
  {
    id: 19,
    img: '/media/prom.webp',
    nameMain: 'Светильник L-industry ',
    nameSpec: '120 Turbine/Em/100/Г30/740/01/IKV-34/230AC IP66',
    type: 'Прожектор',
    category: 'Промышленное освещение',
  },

  //  УЛИЧНОЕ ОСВЕЩЕНИЕ (19 товаров)  /media/ul.webp

  {
    id: 20,
    img: '/media/ul.webp',
    nameMain: 'Светильник L-street ',
    nameSpec: '24/24/Д/5,0K/01/SKII-01/220AC/Premium IP66',
    type: 'Светильник',
    category: 'Уличное освещение',
  },
  {
    id: 21,
    img: '/media/ul.webp',
    nameMain: 'Светильник L-street ',
    nameSpec: '24/24/Д/4,0K/01/SKII-01/220AC/Premium IP66',
    type: 'Светильник',
    category: 'Уличное освещение',
  },
  {
    id: 22,
    img: '/media/ul.webp',
    nameMain: 'Светильник L-street ',
    nameSpec: '24/32/Ш8/4,0K/01/SKII-01/220AC/Premium IP66',
    type: 'Светильник',
    category: 'Уличное освещение',
  },
  {
    id: 23,
    img: '/media/ul.webp',
    nameMain: 'Светильник L-street ',
    nameSpec: '24/32/Ш8/5,0K/01/SKII-01/220AC/Premium IP66',
    type: 'Светильник',
    category: 'Уличное освещение',
  },
  {
    id: 24,
    img: '/media/ul.webp',
    nameMain: 'Светильник L-street ',
    nameSpec: '24/32/Ш3/4,0K/01/SKII-01/220AC/Premium IP66',
    type: 'Светильник',
    category: 'Уличное освещение',
  },
  {
    id: 25,
    img: '/media/ul.webp',
    nameMain: 'Светильник L-street ',
    nameSpec: '24/32/Ш3/5,0K/01/SKII-01/220AC/Premium IP66',
    type: 'Светильник',
    category: 'Уличное освещение',
  },
  {
    id: 26,
    img: '/media/ul.webp',
    nameMain: 'Светильник L-street ',
    nameSpec: '24/32/Ш8/4,0K/01/SKII-01/220AC/Standart IP66',
    type: 'Светильник',
    category: 'Уличное освещение',
  },
  {
    id: 27,
    img: '/media/ul.webp',
    nameMain: 'Светильник L-street ',
    nameSpec: '24/32/Ш3/5,0K/01/SKII-01/220AC/Standart IP66',
    type: 'Светильник',
    category: 'Уличное освещение',
  },
  {
    id: 28,
    img: '/media/ul.webp',
    nameMain: 'Светильник L-street ',
    nameSpec: '24/32/Ш3/4,0K/01/SKII-01/220AC/Standart IP66',
    type: 'Светильник',
    category: 'Уличное освещение',
  },
  {
    id: 29,
    img: '/media/ul.webp',
    nameMain: 'Светильник L-street ',
    nameSpec: '24/32/Ш8/5,0K/01/SKII-01/220AC/Standart IP66',
    type: 'Светильник',
    category: 'Уличное освещение',
  },
  {
    id: 30,
    img: '/media/ul.webp',
    nameMain: 'Светильник L-street ',
    nameSpec: '40 Turbine/15-100/Ш3-К15/5,0K/01/SKV-01GP/220AC IP66 СК/GP',
    type: 'Светильник',
    category: 'Уличное освещение',
  },
  {
    id: 31,
    img: '/media/ul.webp',
    nameMain: 'Светильник L-street ',
    nameSpec: '40 Turbine/15-100/Ш3-К15/4,0K/01/SKV-515GP/220AC IP66 СК/GP',
    type: 'Светильник',
    category: 'Уличное освещение',
  },
  {
    id: 32,
    img: '/media/ul.webp',
    nameMain: 'Светильник L-street ',
    nameSpec: '40 Turbine/15-100/Ш3-К15/5,0K/01/SKV-515GP/220AC IP66 СК/GP',
    type: 'Светильник',
    category: 'Уличное освещение',
  },
  {
    id: 33,
    img: '/media/ul.webp',
    nameMain: 'Светильник L-street ',
    nameSpec: '40 Turbine/15-100/Ш3-К15/4,0K/01/SKV-01GP/220AC IP66 СК/GP',
    type: 'Светильник',
    category: 'Уличное освещение',
  },
  {
    id: 34,
    img: '/media/ul.webp',
    nameMain: 'Светильник L-street ',
    nameSpec: '48/65/Ш3/5,0K/01/SKII-02/220AC/Premium IP66',
    type: 'Светильник',
    category: 'Уличное освещение',
  },
  {
    id: 35,
    img: '/media/ul.webp',
    nameMain: 'Светильник L-street ',
    nameSpec: '48/65/Ш8/4,0K/01/SKII-02/220AC/Premium IP66',
    type: 'Светильник',
    category: 'Уличное освещение',
  },
  {
    id: 36,
    img: '/media/ul.webp',
    nameMain: 'Светильник L-street ',
    nameSpec: '48/65/Ш8/5,0K/01/SKII-02/220AC/Premium IP66',
    type: 'Светильник',
    category: 'Уличное освещение',
  },
  {
    id: 37,
    img: '/media/ul.webp',
    nameMain: 'Светильник L-street ',
    nameSpec: '48/65/Ш3/4,0K/01/SKII-02/220AC/Premium IP66',
    type: 'Светильник',
    category: 'Уличное освещение',
  },
  {
    id: 38,
    img: '/media/ul.webp',
    nameMain: 'Светильник L-street ',
    nameSpec: '48/65/Ш8/4,0K/01/SKII-02/220AC/Standart IP66',
    type: 'Светильник',
    category: 'Уличное освещение',
  },

  // ОФИСНОЕ ОСВЕЩЕНИЕ (21 товар)  /media/of.webp
 
  {
    id: 39,
    img: '/media/of.webp',
    nameMain: 'Светильник L-fusion Office/',
    nameSpec: '30/Д/5,0K/03/OKII-22/220AC IP40 SC',
    type: 'Светильник',
    category: 'Офисное освещение',
  },
  {
    id: 40,
    img: '/media/of.webp',
    nameMain: 'Светильник L-fusion Office/',
    nameSpec: '30/Д/4,0K/03/OKII-22/220AC IP40 SC',
    type: 'Светильник',
    category: 'Офисное освещение',
  },
  {
    id: 41,
    img: '/media/of.webp',
    nameMain: 'Светильник L-office ',
    nameSpec: '32/30/Д/950/03/УК(v2)/220AC/Premium IP54',
    type: 'Светильник',
    category: 'Офисное освещение',
  },
  {
    id: 42,
    img: '/media/of.webp',
    nameMain: 'Светильник L-office ',
    nameSpec: '32/30/Д/950/03/УК(v2)/220AC/Premium IP50 Em',
    type: 'Светильник',
    category: 'Офисное освещение',
  },
  {
    id: 43,
    img: '/media/of.webp',
    nameMain: 'Светильник L-office ',
    nameSpec: '32/20/Д/940/03/УК(v2)/220AC/Premium IP50 S Em',
    type: 'Светильник',
    category: 'Офисное освещение',
  },
  {
    id: 44,
    img: '/media/of.webp',
    nameMain: 'Светильник L-office ',
    nameSpec: '32/30/Д/950/03/УК(SD4)/220AC/Premium IP30 Em',
    type: 'Светильник',
    category: 'Офисное освещение',
  },
  {
    id: 45,
    img: '/media/of.webp',
    nameMain: 'Светильник L-office ',
    nameSpec: '32/30/Д/950/03/УК(SD4)/220AC/Premium IP30',
    type: 'Светильник',
    category: 'Офисное освещение',
  },
  {
    id: 46,
    img: '/media/of.webp',
    nameMain: 'Светильник L-office ',
    nameSpec: '32/30/Д/940/03/УК(v2)/220AC/Premium IP50 Em',
    type: 'Светильник',
    category: 'Офисное освещение',
  },
  {
    id: 47,
    img: '/media/of.webp',
    nameMain: 'Светильник L-office ',
    nameSpec: '32/30/Д/950/03/УК(v2)/220AC/Premium IP50',
    type: 'Светильник',
    category: 'Офисное освещение',
  },
  {
    id: 48,
    img: '/media/of.webp',
    nameMain: 'Светильник L-office ',
    nameSpec: '32/30/Д/940/03/УК(SD4)/220AC/Premium IP30 Em',
    type: 'Светильник',
    category: 'Офисное освещение',
  },
  {
    id: 49,
    img: '/media/of.webp',
    nameMain: 'Светильник L-office ',
    nameSpec: '32/20/Д/940/03/УК(v2)/220AC/Premium IP50 S',
    type: 'Светильник',
    category: 'Офисное освещение',
  },
  {
    id: 50,
    img: '/media/of.webp',
    nameMain: 'Светильник L-office ',
    nameSpec: '32/30/Д/940/03/УК(v2)/220AC/Premium IP54',
    type: 'Светильник',
    category: 'Офисное освещение',
  },
  {
    id: 51,
    img: '/media/of.webp',
    nameMain: 'Светильник L-office ',
    nameSpec: '32/30/Д/940/03/УК(SD4)/220AC/Premium IP30',
    type: 'Светильник',
    category: 'Офисное освещение',
  },
  {
    id: 52,
    img: '/media/of.webp',
    nameMain: 'Светильник L-office ',
    nameSpec: '32/30/Д/940/03/УК(v2)/220AC/Premium IP50',
    type: 'Светильник',
    category: 'Офисное освещение',
  },
  {
    id: 53,
    img: '/media/of.webp',
    nameMain: 'Светильник L-office ',
    nameSpec: '32/30/Д/4,0K/02/УК(SD4)/220AC/Premium IP30',
    type: 'Светильник',
    category: 'Офисное освещение',
  },
  {
    id: 54,
    img: '/media/of.webp',
    nameMain: 'Светильник L-office ',
    nameSpec: '32/30/Д/4,0K/02/УК(SD4)/220AC/Premium IP30 Em',
    type: 'Светильник',
    category: 'Офисное освещение',
  },
  {
    id: 55,
    img: '/media/of.webp',
    nameMain: 'Светильник L-office ',
    nameSpec: '32/30/Д/5,0K/02/УК(SD4)/220AC/Premium IP30',
    type: 'Светильник',
    category: 'Офисное освещение',
  },
  {
    id: 56,
    img: '/media/of.webp',
    nameMain: 'Светильник L-office ',
    nameSpec: '32/30/Д/5,0K/02/УК(SD4)/220AC/Premium IP30 Em',
    type: 'Светильник',
    category: 'Офисное освещение',
  },
  {
    id: 57,
    img: '/media/of.webp',
    nameMain: 'Светильник L-office ',
    nameSpec: '32/30/Д/940/02/УК(SD4)/220AC/Premium IP30 Em',
    type: 'Светильник',
    category: 'Офисное освещение',
  },
  {
    id: 58,
    img: '/media/of.webp',
    nameMain: 'Светильник L-office ',
    nameSpec: '32/30/Д/950/02/УК(SD4)/220AC/Premium IP30 Em',
    type: 'Светильник',
    category: 'Офисное освещение',
  },
  {
    id: 59,
    img: '/media/of.webp',
    nameMain: 'Светильник L-office ',
    nameSpec: '32/30/Д/950/02/УК(SD4)/220AC/Premium IP30',
    type: 'Светильник',
    category: 'Офисное освещение',
  },

  // КОММЕРЧЕСКОЕ ОСВЕЩЕНИЕ (15 товаров) /media/kom.webp
  
  {
    id: 60,
    img: '/media/kom.webp',
    nameMain: 'Светильник L-fusion Office/',
    nameSpec: '45/Д/5,0K/03/IKVI-32/220AC IP40',
    type: 'Светильник',
    category: 'Коммерческое освещение',
  },
  {
    id: 61,
    img: '/media/kom.webp',
    nameMain: 'Светильник L-fusion Office/',
    nameSpec: '50/Д/5,0K/03/IKVI-32/220AC IP40',
    type: 'Светильник',
    category: 'Коммерческое освещение',
  },
  {
    id: 62,
    img: '/media/kom.webp',
    nameMain: 'Светильник L-fusion Office/',
    nameSpec: '50/Д/3,0K/03/IKVI-32/220AC IP40',
    type: 'Светильник',
    category: 'Коммерческое освещение',
  },
  {
    id: 63,
    img: '/media/kom.webp',
    nameMain: 'Светильник L-fusion Office/',
    nameSpec: '50/Д/4,0K/03/IKVI-32/220AC IP40',
    type: 'Светильник',
    category: 'Коммерческое освещение',
  },
  {
    id: 64,
    img: '/media/kom.webp',
    nameMain: 'Светильник L-fusion Office/',
    nameSpec: '45/Д/4,0K/03/IKVI-32/220AC IP40',
    type: 'Светильник',
    category: 'Коммерческое освещение',
  },
  {
    id: 65,
    img: '/media/kom.webp',
    nameMain: 'Светильник L-fusion Office/',
    nameSpec: '30/Д/5,0K/03/IKVI-32/220AC IP40',
    type: 'Светильник',
    category: 'Коммерческое освещение',
  },
  {
    id: 66,
    img: '/media/kom.webp',
    nameMain: 'Светильник L-fusion Office/',
    nameSpec: '30/Д/3,0K/03/IKVI-32/220AC IP40',
    type: 'Светильник',
    category: 'Коммерческое освещение',
  },
  {
    id: 67,
    img: '/media/kom.webp',
    nameMain: 'Светильник L-fusion Office/',
    nameSpec: '30/Д/4,0K/03/IKVI-32/220AC IP40',
    type: 'Светильник',
    category: 'Коммерческое освещение',
  },
  {
    id: 68,
    img: '/media/kom.webp',
    nameMain: 'Светильник L-fusion Retail/',
    nameSpec: '70/Д/850/03/IKVI-22/220AC IP40 Em',
    type: 'Светильник',
    category: 'Коммерческое освещение',
  },
  {
    id: 69,
    img: '/media/kom.webp',
    nameMain: 'Светильник L-fusion Retail/',
    nameSpec: '50/Д/830/03/IKVI-22/220AC IP40 Em',
    type: 'Светильник',
    category: 'Коммерческое освещение',
  },
  {
    id: 70,
    img: '/media/kom.webp',
    nameMain: 'Светильник L-fusion Retail/',
    nameSpec: '70/Д/840/03/IKVI-22/220AC IP40 Em',
    type: 'Светильник',
    category: 'Коммерческое освещение',
  },
  {
    id: 71,
    img: '/media/kom.webp',
    nameMain: 'Светильник L-fusion Retail/',
    nameSpec: '70/Д/830/03/IKVI-22/220AC IP40 Em',
    type: 'Светильник',
    category: 'Коммерческое освещение',
  },
  {
    id: 72,
    img: '/media/kom.webp',
    nameMain: 'Светильник L-fusion Retail/',
    nameSpec: '50/Д/840/03/IKVI-22/220AC IP40 Em',
    type: 'Светильник',
    category: 'Коммерческое освещение',
  },
  {
    id: 73,
    img: '/media/kom.webp',
    nameMain: 'Светильник L-fusion Retail/',
    nameSpec: '36/Д/850/03/IKVI-22/220AC IP40 Em',
    type: 'Светильник',
    category: 'Коммерческое освещение',
  },
  {
    id: 74,
    img: '/media/kom.webp',
    nameMain: 'Светильник L-fusion Retail/',
    nameSpec: '50/Д/850/03/IKVI-22/220AC IP40 Em',
    type: 'Светильник',
    category: 'Коммерческое освещение',
  },

  
  // АРХИТЕКТУРНО-ПАРКОВОЕ ОСВЕЩЕНИЕ (15 товаров) /media/arch.webp
  
  {
    id: 75,
    img: '/media/arch.webp',
    nameMain: 'Светильник L-contour ',
    nameSpec: '950/13,7/Д/Green/03/A1-B2/24DC IP66',
    type: 'Светильник',
    category: 'Архитектурно-парковое освещение',
  },
  {
    id: 76,
    img: '/media/arch.webp',
    nameMain: 'Светильник L-contour ',
    nameSpec: '950/13,7/Д/750/03/A1-B2/24DC IP66',
    type: 'Светильник',
    category: 'Архитектурно-парковое освещение',
  },
  {
    id: 77,
    img: '/media/arch.webp',
    nameMain: 'Светильник L-contour ',
    nameSpec: '950/13,7/Д/740/03/A1-B2/24DC IP66 DMX512',
    type: 'Светильник',
    category: 'Архитектурно-парковое освещение',
  },
  {
    id: 78,
    img: '/media/arch.webp',
    nameMain: 'Светильник L-contour ',
    nameSpec: '950/13,7/Д/740/03/A1-B2/24DC IP66',
    type: 'Светильник',
    category: 'Архитектурно-парковое освещение',
  },
  {
    id: 79,
    img: '/media/arch.webp',
    nameMain: 'Светильник L-contour ',
    nameSpec: '950/13,7/Д/Amber/03/A1-B2/24DC IP66 DMX512',
    type: 'Светильник',
    category: 'Архитектурно-парковое освещение',
  },
  {
    id: 80,
    img: '/media/arch.webp',
    nameMain: 'Светильник L-contour ',
    nameSpec: '950/13,7/Д/730/03/A1-B2/24DC IP66',
    type: 'Светильник',
    category: 'Архитектурно-парковое освещение',
  },
  {
    id: 81,
    img: '/media/arch.webp',
    nameMain: 'Светильник L-contour ',
    nameSpec: '950/13,7/Д/Red/03/A1-B2/24DC IP66 DMX512',
    type: 'Светильник',
    category: 'Архитектурно-парковое освещение',
  },
  {
    id: 82,
    img: '/media/arch.webp',
    nameMain: 'Светильник L-contour ',
    nameSpec: '950/13,7/Д/Red/03/A1-B2/24DC IP66',
    type: 'Светильник',
    category: 'Архитектурно-парковое освещение',
  },
  {
    id: 83,
    img: '/media/arch.webp',
    nameMain: 'Светильник L-contour ',
    nameSpec: '950/13,7/Д/730/03/A1-B2/24DC IP66 DMX512',
    type: 'Светильник',
    category: 'Архитектурно-парковое освещение',
  },
  {
    id: 84,
    img: '/media/arch.webp',
    nameMain: 'Светильник L-facade ',
    nameSpec: '32/Г38/840/01/A2-11/220AC IP66',
    type: 'Светильник',
    category: 'Архитектурно-парковое освещение',
  },
  {
    id: 85,
    img: '/media/arch.webp',
    nameMain: 'Светильник L-facade х2/',
    nameSpec: '37/Г22/830/01/A2-11/220AC IP66',
    type: 'Светильник',
    category: 'Архитектурно-парковое освещение',
  },
  {
    id: 86,
    img: '/media/arch.webp',
    nameMain: 'Светильник L-facade ',
    nameSpec: '32/Г22/840/01/A2-11/220AC IP66',
    type: 'Светильник',
    category: 'Архитектурно-парковое освещение',
  },
  {
    id: 87,
    img: '/media/arch.webp',
    nameMain: 'Светильник L-facade ',
    nameSpec: '32/Г22/830/01/A2-11/220AC IP66',
    type: 'Светильник',
    category: 'Архитектурно-парковое освещение',
  },
  {
    id: 88,
    img: '/media/arch.webp',
    nameMain: 'Светильник L-facade х2/',
    nameSpec: '37/Г38/840/01/A2-11/220AC IP66',
    type: 'Светильник',
    category: 'Архитектурно-парковое освещение',
  },
  {
    id: 89,
    img: '/media/arch.webp',
    nameMain: 'Светильник L-facade х2/',
    nameSpec: '37/Г22/840/01/A2-11/220AC IP66',
    type: 'Светильник',
    category: 'Архитектурно-парковое освещение',
  },
 ];


  const categories = [
    'Все',
    'Промышленное освещение',
    'Уличное освещение',
    'Офисное освещение',
    'Коммерческое освещение',
    'Архитектурно-парковое освещение',
  ];

  // Фильтрация товаров по категории
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'Все') {
      return products;
    }
    return products.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  // Отображаемые товары (с учётом видимого количества)
  const visibleProducts = filteredProducts.slice(0, visibleCount);

  // Сброс количества при смене категории
  useEffect(() => {
    setVisibleCount(9);
  }, [activeCategory]);

  // Обработчик загрузки ещё
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 9);
  };

  // Показывать кнопку, если есть ещё товары
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <section id="catalog" className="bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Заголовок */}
        <h2
          className="text-center mb-6"
          style={{
            fontSize: '42px',
            fontFamily: '"TildaSans", Arial, sans-serif',
            fontWeight: 'bold',
            color: '#000000',
            lineHeight: 1.2,
          }}
        >
          Тысячи светильников под любые задачи с доставкой от 1 дня
        </h2>

        {/* Подзаголовок */}
        <p
          className="text-center max-w-4xl mx-auto mb-12"
          style={{
            fontSize: '24px',
            fontFamily: '"TildaSans", Arial, sans-serif',
            color: '#000000',
            lineHeight: 1.5,
            fontWeight: 'normal',
          }}
        >
          В нашем каталоге представлены тысячи светильников на все случаи жизни.{' '}
          <strong style={{ color: '#d5302c', fontWeight: 'bold' }}>
            Это лишь некоторые из наших моделей.
          </strong>{' '}
          Свяжитесь с нами, и мы подберем идеальные светильники для вашего проекта!
        </p>

        {/* Основной контент */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Левое меню — динамическая высота */}
          <div
            className="bg-gray-100 p-6 rounded-2xl"
            style={{ 
              width: '290px', 
              flexShrink: 0,
              height: 'fit-content',
              minHeight: '500px',
            }}
          >
            <ul className="space-y-4">
              {categories.map((cat, i) => (
                <li key={i}>
                  <button
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left py-3 px-4 rounded-lg transition ${
                      activeCategory === cat 
                        ? 'bg-[#d5302c] text-white font-semibold' 
                        : 'hover:bg-gray-200'
                    }`}
                    style={{
                      fontSize: '16px',
                      fontFamily: '"TildaSans", Arial, sans-serif',
                      fontWeight: activeCategory === cat ? '600' : '400',
                    }}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Каталог справа */}
          <div className="flex-1">
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
              style={{ gap: '100px 50px' }}
            >
              {visibleProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col"
                  style={{ width: '279px', height: '300px' }}
                >
                  {/* Изображение — контейнер 279×209 */}
                  <div
                    className="overflow-hidden"
                    style={{
                      width: '279px',
                      height: '209px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Image
                      src={product.img}
                      alt={product.nameMain}
                      width={279}
                      height={157}
                      className="w-full h-auto object-cover"
                      priority={product.id === 1}
                    />
                  </div>

                  {/* Текстовая часть — 279×188 */}
                  <div
                    className="flex flex-col"
                    style={{
                      width: '279px',
                      height: '188px',
                      gap: '8px',
                    }}
                  >
                    {/* Наименование — 279×54 */}
                    <div
                      className="flex flex-col justify-center"
                      style={{
                        width: '279px',
                        height: '54px',
                        textAlign: 'center',
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '20px',
                          fontFamily: '"TildaSans", Arial, sans-serif',
                          color: '#000000',
                          fontWeight: 600,
                          lineHeight: 1.2,
                          margin: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {product.nameMain}
                      </h3>
                      <div
                        style={{
                          fontSize: '18px',
                          fontFamily: '"TildaSans", Arial, sans-serif',
                          color: '#000000',
                          fontWeight: 600,
                          lineHeight: 1.2,
                          marginTop: '2px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {product.nameSpec}
                      </div>
                    </div>

                    {/* Тип — 279×21 */}
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: '279px',
                        height: '21px',
                      }}
                    >
                      <p
                        style={{
                          fontSize: '14px',
                          fontFamily: '"TildaSans", Arial, sans-serif',
                          color: '#666666',
                          fontWeight: 'normal',
                          lineHeight: 1,
                          margin: 0,
                          textAlign: 'center',
                        }}
                      >
                        {product.type}
                      </p>
                    </div>

                    {/* Кнопка — 279×53 */}
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: '279px',
                        height: '53px',
                      }}
                    >
                      <button
                        className="w-[143px] h-[45px] bg-red-600 text-white font-bold rounded-[30px] hover:bg-red-700 transition flex items-center justify-center"
                        style={{
                          fontSize: '14px',
                          fontFamily: '"TildaSans", Arial, sans-serif',
                          textAlign: 'center',
                        }}
                      >
                        ПОДРОБНЕЕ
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Кнопка "Загрузить ещё" */}
            {hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={handleLoadMore}
                  className="px-12 py-4 bg-[#d5302c] text-white font-bold rounded-[30px] hover:bg-[#b52824] transition"
                  style={{
                    fontSize: '16px',
                    fontFamily: '"TildaSans", Arial, sans-serif',
                  }}
                >
                  ЗАГРУЗИТЬ ЕЩЁ
                </button>
              </div>
            )}

            {/* Счётчик товаров */}
            <div className="text-center mt-6">
              <p 
                className="text-gray-600"
                style={{ 
                  fontSize: '16px', 
                  fontFamily: '"TildaSans", Arial, sans-serif' 
                }}
              >
                Показано {visibleProducts.length} из {filteredProducts.length} товаров
                {activeCategory !== 'Все' && ` в категории "${activeCategory}"`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}