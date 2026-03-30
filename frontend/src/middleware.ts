import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Защищенные маршруты админ-панели (кроме login)
const adminRoutes = ['/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Проверяем, является ли путь маршрутом админ-панели
  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route) && pathname !== '/admin/login'
  );

  // Если это страница login, пропускаем
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Если это маршрут админ-панели, проверяем авторизацию
  if (isAdminRoute) {
    const auth = request.cookies.get('adminAuth');
    
    if (!auth) {
      // Перенаправляем на страницу входа
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
