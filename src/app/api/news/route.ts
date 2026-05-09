import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.NEWS_API_KEY;
const BASE_URL = 'https://gnews.io/api/v4';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpoint = searchParams.get('endpoint') || 'top-headlines';
  const pageSize = searchParams.get('pageSize') || '20';
  const category = searchParams.get('category') || 'general';
  const q = searchParams.get('q') || '';

  if (!API_KEY) {
    return NextResponse.json(
      { error: 'News API key not configured' },
      { status: 500 }
    );
  }

  try {
    const params = new URLSearchParams({
      apikey: API_KEY,
      max: pageSize,
      lang: 'en',
      country: 'us',
    });

    let url: string;

    if (endpoint === 'everything' && q) {
      // Search endpoint
      params.append('q', q);
      url = `${BASE_URL}/search?${params.toString()}`;
    } else {
      // Top headlines by category
      if (category && category !== '') {
        params.append('topic', mapCategory(category));
      }
      url = `${BASE_URL}/top-headlines?${params.toString()}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch news' }));
      return NextResponse.json(
        { error: error.errors?.[0] || error.message || `HTTP error ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Normalize GNews response to match NewsAPI shape the frontend expects
    const normalized = {
      status: 'ok',
      totalResults: data.totalArticles ?? data.articles?.length ?? 0,
      articles: (data.articles ?? []).map((a: any) => ({
        source: { id: null, name: a.source?.name ?? 'Unknown' },
        author: a.source?.name ?? null,
        title: a.title,
        description: a.description,
        url: a.url,
        urlToImage: a.image,
        publishedAt: a.publishedAt,
        content: a.content,
      })),
    };

    return NextResponse.json(normalized);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

// Map NewsAPI categories to GNews topics
function mapCategory(category: string): string {
  const map: Record<string, string> = {
    general: 'breaking-news',
    business: 'business',
    technology: 'technology',
    sports: 'sports',
    entertainment: 'entertainment',
    health: 'health',
    science: 'science',
  };
  return map[category] ?? 'breaking-news';
}
