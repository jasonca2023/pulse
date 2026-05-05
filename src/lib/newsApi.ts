import { NewsApiResponse, Category, Country } from '@/types';

const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

if (!API_KEY) {
  console.warn('Warning: NEXT_PUBLIC_NEWS_API_KEY is not set. App may not work correctly.');
}

async function fetchNews<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const urlParams = new URLSearchParams({
    apiKey: API_KEY || '',
    ...params,
  });

  const response = await fetch(`${BASE_URL}${endpoint}?${urlParams.toString()}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch news' }));
    throw new Error(error.message || `HTTP error ${response.status}`);
  }

  return response.json();
}

export async function getTopHeadlines(
  country: Country = 'us',
  category?: Category,
  pageSize: number = 20
): Promise<NewsApiResponse> {
  const params: Record<string, string> = {
    country,
    pageSize: pageSize.toString(),
  };

  if (category) {
    params.category = category;
  }

  return fetchNews<NewsApiResponse>('/top-headlines', params);
}

export async function searchNews(
  query: string,
  pageSize: number = 20,
  sortBy: 'relevancy' | 'popularity' | 'publishedAt' = 'publishedAt'
): Promise<NewsApiResponse> {
  return fetchNews<NewsApiResponse>('/everything', {
    q: query,
    pageSize: pageSize.toString(),
    sortBy,
  });
}

export async function getEverything(
  query: string,
  pageSize: number = 20
): Promise<NewsApiResponse> {
  return fetchNews<NewsApiResponse>('/everything', {
    q: query,
    pageSize: pageSize.toString(),
    sortBy: 'publishedAt',
  });
}