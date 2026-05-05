import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

const IP_TO_COUNTRY: Record<string, string> = {
  'us': 'us', 'gb': 'gb', 'ca': 'ca', 'au': 'au', 'de': 'de',
  'fr': 'fr', 'jp': 'jp', 'in': 'in', 'it': 'it', 'br': 'br',
  'ru': 'ru', 'es': 'es', 'mx': 'mx', 'kr': 'kr', 'nl': 'nl',
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpoint = searchParams.get('endpoint') || 'top-headlines';
  const pageSize = searchParams.get('pageSize') || '20';
  const country = searchParams.get('country') || 'us';
  const category = searchParams.get('category') || '';
  const q = searchParams.get('q') || '';
  const sortBy = searchParams.get('sortBy') || 'publishedAt';
  const userCountry = searchParams.get('userCountry') || '';

  if (!API_KEY) {
    return NextResponse.json(
      { error: 'News API key not configured' },
      { status: 500 }
    );
  }

  try {
    const params = new URLSearchParams({
      apiKey: API_KEY,
      pageSize,
    });

    if (endpoint === 'top-headlines') {
      params.append('country', 'us');
      if (category) params.append('category', category);
    } else {
      params.append('qInTitle', q);
      params.append('sortBy', 'relevancy');
      params.append('language', 'en');
    }

    const response = await fetch(`${BASE_URL}/${endpoint}?${params.toString()}`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch news' }));
      return NextResponse.json(
        { error: error.message || `HTTP error ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}