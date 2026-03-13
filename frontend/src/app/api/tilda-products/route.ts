// src/app/api/tilda-products/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const API_URL = 'https://store.tildacdn.com/api/getproductslist/';
  const params = new URLSearchParams({
    storepartuid: '508199045462',
    recid: '766672722',
    getparts: 'true',
    size: '500',
    slice: '0',
  });

  try {
    const response = await fetch(`${API_URL}?${params}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('Ошибка при получении товаров из Tilda:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error },
      { status: 500 }
    );
  }
}