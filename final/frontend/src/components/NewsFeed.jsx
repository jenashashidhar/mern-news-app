import React, { useState } from "react";

export default function NewsFeed({ articles, loading }) {

  const [expandedCard, setExpandedCard] = useState(null);

  // Toggle Summary
  const handleSummary = (index) => {
    if (expandedCard === index) {
      setExpandedCard(null);
    } else {
      setExpandedCard(index);
    }
  };

  // Loading
  if (loading) {
    return (
      <div style={{ color: "white" }}>
        Loading latest tech news...
      </div>
    );
  }

  // No articles
  if (!articles || articles.length === 0) {
    return (
      <div style={{ color: "white" }}>
        No articles found.
      </div>
    );
  }

  return (

    <div
      style={{
        display: "grid",
        gap: "25px",
      }}
    >

      {articles.slice(0, 6).map((article, index) => {

        const summary =
          article.description ||
          article.content ||
          "No AI summary available.";

        const articleLink =
          article.url ||
          article.link ||
          article.sourceUrl;

        return (

          <div
            key={index}
            style={{
              background: "#111827",
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid #2d3748",
            }}
          >

            {/* IMAGE */}
            {(article.image || article.urlToImage) && (

              <img
                src={article.image || article.urlToImage}
                alt={article.title}
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                }}
              />

            )}

            {/* CONTENT */}
            <div style={{ padding: "18px" }}>

              {/* SOURCE */}
              <div
                style={{
                  color: "#00d4ff",
                  fontWeight: "bold",
                  marginBottom: "10px",
                  fontSize: "14px",
                }}
              >
                {article.source?.name || "Tech News"}
              </div>

              {/* TITLE */}
              <h2
                style={{
                  color: "white",
                  fontSize: "20px",
                  marginBottom: "12px",
                  lineHeight: "1.4",
                }}
              >
                {article.title}
              </h2>

              {/* DATE */}
              <p
                style={{
                  color: "#9ca3af",
                  marginBottom: "16px",
                }}
              >
                {article.publishedAt
                  ? new Date(
                      article.publishedAt
                    ).toLocaleDateString()
                  : "Latest"}
              </p>

              {/* BUTTONS */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >

                {/* SUMMARY BUTTON */}
                <button
                  onClick={() => handleSummary(index)}
                  style={{
                    background: "#00d4ff",
                    color: "black",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  {expandedCard === index
                    ? "Hide Summary"
                    : "AI Summary"}
                </button>

                {/* ARTICLE BUTTON */}
                <button
                  onClick={() => {

                    if (articleLink) {
                      window.open(
                        articleLink,
                        "_blank"
                      );
                    } else {
                      alert(
                        "Article link unavailable"
                      );
                    }

                  }}
                  style={{
                    background: "#7c3aed",
                    color: "white",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Read Article
                </button>

              </div>

              {/* SUMMARY BOX */}
              {expandedCard === index && (

                <div
                  style={{
                    marginTop: "20px",
                    background: "#1f2937",
                    padding: "18px",
                    borderRadius: "12px",
                    color: "#e5e7eb",
                    lineHeight: "1.7",
                  }}
                >

                  <h3
                    style={{
                      color: "#00d4ff",
                      marginBottom: "12px",
                    }}
                  >
                    AI Quick Summary
                  </h3>

                  <p>
                    {summary}
                  </p>

                </div>

              )}

            </div>

          </div>

        );
      })}

    </div>

  );
}