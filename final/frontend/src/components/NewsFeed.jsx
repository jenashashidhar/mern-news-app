import React, { useState } from 'react';
import { Cpu, ChevronDown, ChevronUp } from 'lucide-react';

export default function NewsFeed({ articles, loading }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (index) => {
    setExpandedId(expandedId === index ? null : index);
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ color: 'var(--text-secondary)' }}>
        Fusing data streams...
      </div>
    );
  }

  // No articles
  if (!articles || articles.length === 0) {
    return (
      <div style={{ color: 'var(--text-secondary)' }}>
        No articles found.
      </div>
    );
  }

  return (
    <div className="news-grid">
      {articles.slice(0, 6).map((article, idx) => {

        const articleLink =
          article.url ||
          article.link ||
          article.sourceUrl ||
          article.href;

        return (
          <div
            key={idx}
            className="news-card"
            onClick={() => toggleExpand(idx)}
            style={{ cursor: 'pointer' }}
          >

            {/* Image */}
            {(article.image || article.urlToImage) && (
              <img
                src={article.image || article.urlToImage}
                alt={article.title}
                className="news-card-image"
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '10px'
                }}
              />
            )}

            {/* Content */}
            <div className="news-card-content">

              {/* Source */}
              <div className="news-card-source">
                {article.source?.name || 'Indian Express'}
              </div>

              {/* Title */}
              <h3 className="news-card-title">
                {article.title || 'No Title'}
              </h3>

              {/* Date */}
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

            {/* Expanded Section */}
            {expandedId === idx && (
              <div
                style={{
                  marginTop: '15px',
                  padding: '15px',
                  background: '#111827',
                  borderRadius: '10px',
                }}
              >

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '10px',
                    color: '#00d4ff',
                    fontWeight: 'bold'
                  }}
                >
                  <Cpu size={14} />
                  AI Quick Summary
                </div>

                <p
                  style={{
                    color: '#d1d5db',
                    lineHeight: '1.6'
                  }}
                >
                  {article.description ||
                    article.content ||
                    'No summary available for this article.'}
                </p>

                {/* Button */}
                {articleLink ? (
                  <a
                    href={articleLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: 'inline-block',
                      marginTop: '15px',
                      background: '#00d4ff',
                      color: 'black',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                    }}
                  >
                    Read Full Article
                  </a>
                ) : (
                  <p style={{ color: 'red', marginTop: '10px' }}>
                    Article link not available
                  </p>
                )}

              </div>
            )}

          </div>
        );
      })}
    </div>
  );
}