import React, { useState } from 'react';
import { Cpu, ChevronDown, ChevronUp } from 'lucide-react';

export default function NewsFeed({ articles, loading }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (index) => {
    setExpandedId(expandedId === index ? null : index);
  };

  // Loading State
  if (loading) {
    return (
      <div style={{ color: 'var(--text-secondary)' }}>
        Fusing data streams...
      </div>
    );
  }

  // No Articles
  if (!articles || articles.length === 0) {
    return (
      <div style={{ color: 'var(--text-secondary)' }}>
        No articles found.
      </div>
    );
  }

  return (
    <div className="news-grid">
      {articles.slice(0, 6).map((article, idx) => (

        <div
          key={idx}
          className="news-card"
          onClick={() => toggleExpand(idx)}
          style={{
            cursor: 'pointer',
            transition: '0.3s ease'
          }}
        >

          {/* Article Image */}
          {(article.image || article.urlToImage) && (
            <img
              src={article.image || article.urlToImage}
              alt={article.title}
              className="news-card-image"
              style={{
                width: '100%',
                height: '220px',
                objectFit: 'cover',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px'
              }}
            />
          )}

          {/* Card Content */}
          <div className="news-card-content">

            {/* Source */}
            <div className="news-card-source">
              {article.source?.name || 'Indian Express'}
            </div>

            {/* Title */}
            <h3 className="news-card-title">
              {article.title}
            </h3>

            {/* Meta */}
            <div className="news-card-meta">

              <span>
                {article.publishedAt
                  ? new Date(article.publishedAt).toLocaleDateString()
                  : 'Latest News'}
              </span>

              {expandedId === idx ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}

            </div>

          </div>

          {/* Expandable Summary */}
          <div
            className={`news-summary-expand ${
              expandedId === idx ? 'active' : ''
            }`}
            style={{
              padding: expandedId === idx ? '1rem' : '0 1rem',
              maxHeight: expandedId === idx ? '500px' : '0px',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
          >

            {/* Summary Label */}
            <div
              className="summary-label"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
                color: '#00d4ff',
                fontWeight: 'bold'
              }}
            >
              <Cpu size={14} />
              AI Quick Summary
            </div>

            {/* Summary */}
            <p
              className="summary-text"
              style={{
                color: '#d1d5db',
                lineHeight: '1.6'
              }}
            >
              {article.description ||
                article.content ||
                'No summary available for this article.'}
            </p>

            {/* Read Full Article Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();

                const link =
                  article.link ||
                  article.url ||
                  article.sourceUrl;

                if (link) {
                  window.open(
                    link,
                    '_blank',
                    'noopener,noreferrer'
                  );
                } else {
                  alert('Article link not available');
                }
              }}
              style={{
                marginTop: '16px',
                background: '#00d4ff',
                color: '#000',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              Read Full Article
            </button>

          </div>

        </div>

      ))}
    </div>
  );
}