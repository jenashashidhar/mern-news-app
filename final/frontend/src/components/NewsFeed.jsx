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
          style={{ cursor: 'pointer' }}
        >
          {/* Article Image */}
          {(article.image || article.urlToImage) && (
            <img
              src={article.image || article.urlToImage}
              alt={article.title}
              className="news-card-image"
            />
          )}

          {/* Card Content */}
          <div className="news-card-content">

            {/* Source */}
            <div className="news-card-source">
              {article.source?.name || 'Unknown Source'}
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
                  : 'No Date'}
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
          >
            <div className="summary-label">
              <Cpu size={14} /> AI Quick Summary
            </div>

            {/* Summary */}
            <p className="summary-text">
              {article.description ||
                article.content ||
                'No summary available for this article.'}
            </p>

            {/* Read Full Article Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();

                const link =
                  article.url ||
                  article.link ||
                  article.sourceUrl;

                if (link) {
                  window.open(link, '_blank');
                } else {
                  alert('Article link not available');
                }
              }}
              style={{
                marginTop: '10px',
                background: '#00d4ff',
                color: 'black',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
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