'use client';

import { useState, useEffect, useMemo } from 'react';
import { Article, NewsApiResponse, CATEGORIES, Category } from '@/types';

const ALL_CATEGORIES: { value: Category | ''; label: string }[] = [
  { value: '', label: 'All' },
  ...CATEGORIES,
];

function calculateReadTime(content: string | null): string {
  if (!content) return '1 min';
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export function NewsFeed() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<Category>('general');
  const [userCountry, setUserCountry] = useState('');
  const [summaries, setSummaries] = useState<Record<number, string>>({});
  const [loadingSummary, setLoadingSummary] = useState<number | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const searchTerms = [
    'afghanistan', 'albania', 'algeria', 'argentina', 'australia', 'austria', 'bahrain', 'bangladesh', 'belgium', 'brazil',
    'canada', 'chile', 'china', 'colombia', 'croatia', 'cuba', 'czech', 'denmark', 'egypt', 'finland', 'france', 'germany',
    'greece', 'honduras', 'hormuz', 'hungary', 'india', 'indonesia', 'iran', 'iraq', 'ireland', 'israel', 'italy', 'japan',
    'jordan', 'kenya', 'korea', 'kuwait', 'lebanon', 'malaysia', 'mexico', 'morocco', 'netherlands', 'new zealand', 'nigeria',
    'norway', 'pakistan', 'peru', 'philippines', 'poland', 'portugal', 'qatar', 'romania', 'russia', 'saudi', 'singapore',
    'south africa', 'spain', 'sweden', 'switzerland', 'syria', 'taiwan', 'thailand', 'turkey', 'uae', 'uk', 'ukraine',
    'venezuela', 'vietnam', 'yemen',
    'technology', 'tech', 'sports', 'business', 'entertainment', 'health', 'science', 'politics', 'world', 'news',
    'election', 'trump', 'biden', 'ai', 'climate', 'economy', 'stock', 'market', 'football', 'basketball', 'soccer',
    'olympics', 'movie', 'music', 'netflix', 'covid', 'vaccine', 'space', 'nasa', 'war', 'military',
  ];

  const levenshtein = (a: string, b: string): number => {
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        matrix[i][j] = b.charAt(i - 1) === a.charAt(j - 1)
          ? matrix[i - 1][j - 1]
          : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
      }
    }
    return matrix[b.length][a.length];
  };

  const findClosest = (query: string, terms: string[]): string | null => {
    const q = query.toLowerCase();
    let best: string | null = null;
    let bestScore = Infinity;
    for (const term of terms) {
      const score = levenshtein(q, term);
      if (score < bestScore) {
        bestScore = score;
        best = term;
      }
    }
    return best && bestScore <= Math.floor(best.length / 2) + 1 ? best : null;
  };

  const fuzzySearch = (query: string): string => {
    const result = findClosest(query, searchTerms);
    return result || query;
  };

  useEffect(() => {
    const detectCountry = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data.country_code) {
          setUserCountry(data.country_code.toLowerCase());
        }
      } catch {
        setUserCountry('us');
      }
    };
    detectCountry();
  }, []);

  const generateSummary = async (article: Article, index: number) => {
    setLoadingSummary(index);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const summary = article.description || 'Summary not available for this article.';
    setSummaries(prev => ({ ...prev, [index]: summary }));
    setLoadingSummary(null);
  };

  const hideSummary = (index: number) => {
    setSummaries(prev => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  };

  const fetchNews = async () => {
    setLoading(true);
    setError(null);

    try {
      let url = `/api/news?endpoint=top-headlines&country=us&pageSize=20`;
      if (category) {
        url += `&category=${category}`;
      }
      if (userCountry) {
        url += `&userCountry=${userCountry}`;
      }

      const response = await fetch(url);
      const data: NewsApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.status || 'Failed to fetch news');
      }

      setArticles(data.articles || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  const searchNews = async () => {
    if (!searchQuery.trim()) {
      fetchNews();
      return;
    }

    setLoading(true);
    setError(null);
    setSuggestion(null);

    try {
      const url = `/api/news?endpoint=everything&q=${encodeURIComponent(searchQuery)}&pageSize=20&sortBy=publishedAt`;
      const response = await fetch(url);
      const data: NewsApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.status || 'Failed to search news');
      }

      if (!data.articles || data.articles.length === 0) {
        const corrected = fuzzySearch(searchQuery);
        if (corrected.toLowerCase() !== searchQuery.toLowerCase()) {
          setSuggestion(corrected);
          const fuzzyUrl = `/api/news?endpoint=everything&q=${encodeURIComponent(corrected)}&pageSize=20&sortBy=publishedAt`;
          const fuzzyResponse = await fetch(fuzzyUrl);
          const fuzzyData: NewsApiResponse = await fuzzyResponse.json();
          setArticles(fuzzyData.articles || []);
        } else {
          setArticles([]);
        }
      } else {
        setArticles(data.articles || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [category]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchNews();
  };

  return (
    <div>
      <div className="controls">
        <form onSubmit={handleSearch} className="searchForm">
          <div className="inputWrapper">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news..."
              className="searchInput"
            />
            {searchQuery && (
              <button 
                type="button" 
                className="clearBtn"
                onClick={() => setSearchQuery('')}
              >
                ×
              </button>
            )}
          </div>
          <button type="submit" className="searchButton">Search</button>
        </form>
      </div>

      <div className="tabs">
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            className={`tab ${category === cat.value ? 'active' : ''}`}
            onClick={() => setCategory(cat.value as Category)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading news...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : articles.length === 0 ? (
        <div className="noResults">
          {suggestion ? (
            <div>
              No results for "{searchQuery}". Did you mean{' '}
              <button
                className="suggestionBtn"
                onClick={() => { setSearchQuery(suggestion); searchNews(); }}
              >
                {suggestion}
              </button>
              ?
            </div>
          ) : (
            'No news found'
          )}
        </div>
      ) : (
        <div className="articlesGrid">
          {articles.map((article, index) => (
            <article
              key={`${article.url}-${index}`}
              className="card"
              onClick={() => window.open(article.url, '_blank')}
              style={{ cursor: 'pointer' }}
            >
              {article.urlToImage && (
                <div className="image">
                  <img src={article.urlToImage} alt={article.title} />
                </div>
              )}
              <div className="content">
                <span className="source">{article.source.name}</span>
                <h3 className="title">{article.title}</h3>
                <div className="meta">
                  <span className="readTime">{calculateReadTime(article.content)}</span>
                </div>
                {summaries[index] ? (
                  <div className="summaryBox">
                    <p className="summary">{summaries[index]}</p>
                    <button 
                      className="hideBtn"
                      onClick={(e) => { e.stopPropagation(); hideSummary(index); }}
                    >
                      Hide
                    </button>
                  </div>
                ) : (
                  <button 
                    className="summaryBtn"
                    onClick={(e) => { e.stopPropagation(); generateSummary(article, index); }}
                    disabled={loadingSummary === index}
                  >
                    {loadingSummary === index ? 'Generating...' : 'AI Summary'}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}