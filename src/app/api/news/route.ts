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
    const localParams = new URLSearchParams({
      apiKey: API_KEY,
      pageSize: String(Number(pageSize) / 2),
    });

    const generalParams = new URLSearchParams({
      apiKey: API_KEY,
      pageSize: String(Number(pageSize) / 2),
    });

    if (endpoint === 'top-headlines') {
      if (userCountry && IP_TO_COUNTRY[userCountry]) {
        localParams.append('country', IP_TO_COUNTRY[userCountry]);
        if (category) localParams.append('category', category);
      } else {
        localParams.append('country', country);
        if (category) localParams.append('category', category);
      }

      generalParams.append('country', country);
      if (category) generalParams.append('category', category);
    } else {
      localParams.append('qInTitle', q);
      localParams.append('sortBy', 'relevancy');
      localParams.append('language', 'en');

      generalParams.append('qInTitle', q);
      generalParams.append('sortBy', 'relevancy');
      generalParams.append('language', 'en');
    }

    const [localRes, generalRes] = await Promise.all([
      fetch(`${BASE_URL}/${endpoint}?${localParams.toString()}`),
      fetch(`${BASE_URL}/${endpoint}?${generalParams.toString()}`),
    ]);

    const [localData, generalData] = await Promise.all([
      localRes.ok ? localRes.json() : { articles: [] },
      generalRes.ok ? generalRes.json() : { articles: [] },
    ]);

    const combinedArticles = [
      ...(localData.articles || []),
      ...(generalData.articles || []),
    ];

    return NextResponse.json({
      ...generalData,
      articles: combinedArticles,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}