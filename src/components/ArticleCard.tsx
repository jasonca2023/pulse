'use client';

import Image from 'next/image';
import { format } from 'date-fns';
import { Article } from '@/types';
import styles from './ArticleCard.module.css';

interface ArticleCardProps {
  article: Article;
  onClick?: () => void;
}

export function ArticleCard({ article, onClick }: ArticleCardProps) {
  const formattedDate = article.publishedAt
    ? format(new Date(article.publishedAt), 'MMM d, yyyy')
    : '';

  return (
    <article className={styles.card} onClick={onClick}>
      {article.urlToImage && (
        <div className={styles.image}>
          <Image
            src={article.urlToImage}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            unoptimized
          />
        </div>
      )}
      <div className={styles.content}>
        <span className={styles.source}>{article.source.name}</span>
        <h3 className={styles.title}>{article.title}</h3>
        {article.description && (
          <p className={styles.description}>{article.description}</p>
        )}
        <div className={styles.meta}>
          {article.author && <span className={styles.author}>{article.author}</span>}
          <span className={styles.date}>{formattedDate}</span>
        </div>
      </div>
    </article>
  );
}