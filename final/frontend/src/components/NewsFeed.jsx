```javascript
import React, { useEffect, useState } from "react";

export default function NewsFeed() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/tech-news")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch news");
        }
        return res.json();
      })
      .then((data) => {
        console.log("API DATA:", data);

        if (Array.isArray(data)) {
          setArticles(data);
        } else {
          setError("Invalid data received");
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Backend not connected");
        setLoading(false);
      });
  }, []);

  return (
    <div
      style={{
        background: "#020617",
        minHeight: "100vh",
        padding: "30px",
        color: "white",
        fontFamily: "Arial",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "42px",
          marginBottom: "40px",
          color: "#38bdf8",
        }}
      >
        AI Tech News Dashboard
      </h1>

      {loading && (
        <h2
          style={{
            textAlign: "center",
            color: "#94a3b8",
          }}
        >
          Loading latest tech news...
        </h2>
      )}

      {error && (
        <div
          style={{
            background: "#7f1d1d",
            padding: "15px",
            borderRadius: "10px",
            textAlign: "center",
            marginBottom: "20px",
            color: "white",
          }}
        >
          {error}
        </div>
      )}

      {!loading && articles.length === 0 && (
        <h2
          style={{
            textAlign: "center",
            color: "#f87171",
          }}
        >
          No articles found
        </h2>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "25px",
        }}
      >
        {articles.map((article, index) => (
          <div
            key={index}
            style={{
              background: "#111827",
              padding: "20px",
              borderRadius: "16px",
              border: "1px solid #1e293b",
              boxShadow: "0 0 20px rgba(56,189,248,0.15)",
            }}
          >
            <h2
              style={{
                color: "#38bdf8",
                marginBottom: "15px",
                fontSize: "24px",
              }}
            >
              {article.title}
            </h2>

            <p
              style={{
                color: "#cbd5e1",
                lineHeight: "1.8",
                marginBottom: "20px",
              }}
            >
              {article.summary}
            </p>

            <a
              href={article.link}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block",
                background: "#38bdf8",
                color: "#0f172a",
                padding: "10px 18px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Read Full Article
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
```
