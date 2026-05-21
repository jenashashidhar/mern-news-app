import React, { useState } from 'react';

export default function NewsFeed({ articles, loading }) {

  const [openIndex, setOpenIndex] = useState(null);

  const toggleSummary = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) {
    return <p style={{ color: 'white' }}>Loading news...</p>;
  }

  if (!articles || articles.length === 0) {
    return <p style={{ color: 'white' }}>No articles found.</p>;
  }

  return (

    <div
      style={{
        display: 'grid',
        gap: '20px'
      }}
    >

      {articles.slice(0, 6).map((article, index) => (

        <div
          key={index}
          style={{
            background: '#111827',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid #333'
          }}
        >

          {/* IMAGE */}
          {(article.image || article.urlToImage) && (

            <img
              src={article.image || article.urlToImage}
              alt={article.title}
              style={{
                width: '100%',
                height: '220px',
                objectFit: 'cover'
              }}
            />

          )}

          {/* CONTENT */}
          <div style={{ padding: '16px' }}>

            {/* SOURCE */}
            <p
              style={{
                color: '#00d4ff',
                fontSize: '14px',
                marginBottom: '10px',
                fontWeight: 'bold'
              }}
            >
              {article.source?.name || 'Tech News'}
            </p>

            {/* TITLE */}
            <h2
              style={{
                color: 'white',
                fontSize: '20px',
                marginBottom: '12px'
              }}
            >
              {article.title}
            </h2>

            {/* DATE */}
            <p
              style={{
                color: '#9ca3af',
                marginBottom: '15px'
              }}
            >
              {article.publishedAt
                ? new Date(article.publishedAt).toLocaleDateString()
                : 'Latest'}
            </p>

            {/* BUTTONS */}
            <div
              style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap'
              }}
            >

              {/* SUMMARY BUTTON */}
              <button
                onClick={() => toggleSummary(index)}
                style={{
                  background: '#00d4ff',
                  color: 'black',
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {openIndex === index
                  ? 'Hide Summary'
                  : 'AI Summary'}
              </button>

              {/* READ ARTICLE */}
              <button
                onClick={() => {

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
                  background: '#7c3aed',
                  color: 'white',
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Read Article
              </button>

            </div>

            {/* SUMMARY BOX */}
            {openIndex === index && (

              <div
                style={{
                  marginTop: '18px',
                  background: '#1f2937',
                  padding: '16px',
                  borderRadius: '10px',
                  color: '#e5e7eb',
                  lineHeight: '1.7'
                }}
              >

                <h4
                  style={{
                    color: '#00d4ff',
                    marginBottom: '10px'
                  }}
                >
                  AI Quick Summary
                </h4>

                <p>
                  {article.description ||
                    article.content ||
                    'No summary available.'}
                </p>

              </div>

            )}

          </div>

        </div>

      ))}

    </div>

  );
}