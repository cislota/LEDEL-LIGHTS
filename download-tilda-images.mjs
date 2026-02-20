// download-tilda-images.mjs
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, 'media');
const TARGET_URL = 'https://ledl-lights.ru/';

const ALLOWED_EXTENSIONS = new Set([
  '.jpg', '.jpeg',
  '.png',
  '.webp',
  '.svg'
]);

function hasAllowedExtension(url) {
  try {
    const pathname = new URL(url).pathname.toLowerCase();
    for (const ext of ALLOWED_EXTENSIONS) {
      if (pathname.endsWith(ext)) return true;
    }
  } catch {}
  return false;
}

function generateUniqueFilename(url) {
  // Извлекаем базовое имя и расширение
  let basename = path.basename(new URL(url).pathname) || 'image';
  let ext = path.extname(basename).toLowerCase();

  // Определяем расширение, если его нет или оно не поддерживается
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    ext =
      url.includes('.svg') ? '.svg' :
      url.includes('.webp') ? '.webp' :
      url.includes('.png') ? '.png' :
      url.includes('.jpeg') ? '.jpeg' : '.jpg';
    basename = basename.replace(/\.[^/.]+$/, ''); // удаляем старое расширение, если есть
  }

  // Генерируем короткий хеш из URL (12 символов)
  const hash = createHash('md5').update(url).digest('hex').substring(0, 12);
  
  // Формируем безопасное имя: originalName_hash.ext
  const cleanName = basename.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${cleanName}_${hash}${ext}`;
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const downloaded = new Set();

  page.on('response', async (response) => {
    const url = response.url();
    if (downloaded.has(url)) return;
    if (!hasAllowedExtension(url)) return;
    if (response.status() !== 200) return;

    try {
      const buffer = await response.buffer();
      if (!buffer?.length) return;

      const filename = generateUniqueFilename(url);
      const filepath = path.join(OUTPUT_DIR, filename);

      await fs.writeFile(filepath, buffer);
      downloaded.add(url);
      console.log('✅', filename);
    } catch (err) {
      // Игнорируем ошибки (CORS, partial content и т.д.)
    }
  });

  console.log('Загрузка страницы...');
  await page.goto(TARGET_URL, { waitUntil: 'networkidle0', timeout: 60000 });

  // Собираем все кандидаты (для логирования пропущенных)
  const allCandidateUrls = await page.evaluate(() => {
    const urls = new Set();
    document.querySelectorAll('img[src]').forEach(el => {
      try { urls.add(new URL(el.src, window.location.href).href); } catch {}
    });
    const all = document.querySelectorAll('*');
    for (const el of all) {
      const bg = getComputedStyle(el).backgroundImage;
      const match = bg.match(/url\(['"]?([^'"]+)['"]?\)/i);
      if (match) {
        try { urls.add(new URL(match[1], window.location.href).href); } catch {}
      }
    }
    return Array.from(urls).filter(url => url.startsWith('http'));
  });

  console.log(`Найдено ${allCandidateUrls.length} кандидатов. Прокрутка для lazy-load...`);

  // Прокрутка вниз
  let scrollCount = 0;
  const maxScrolls = 10;
  let lastHeight;
  do {
    lastHeight = await page.evaluate('document.body.scrollHeight');
    await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
    await new Promise(resolve => setTimeout(resolve, 2000));
    scrollCount++;
  } while (
    scrollCount < maxScrolls &&
    lastHeight < await page.evaluate('document.body.scrollHeight')
  );

  await new Promise(resolve => setTimeout(resolve, 3000));

  await browser.close();

  // Логируем пропущенные
  const missed = allCandidateUrls.filter(url => hasAllowedExtension(url) && !downloaded.has(url));
  if (missed.length > 0) {
    console.log(`\n⚠️ Не скачано ${missed.length} файлов:`);
    missed.forEach(url => console.log('  ❌', url));
  }

  console.log(`\n✅ Готово! Скачано ${downloaded.size} файлов в:`, OUTPUT_DIR);
}

main().catch(console.error);