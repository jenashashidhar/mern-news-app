import React, { useEffect, useState } from "react";

export default function NewsFeed() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/tech-news")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div
        style={{
          color: "white",
          textAlign: "center",
          marginTop: "50px",
          fontSize: "24px",
        }}
      >
        Loading Tech News...
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#0f172a",
        minHeight: "100vh",
        padding: "30px",
        color: "white",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "40px",
          fontSize: "42px",
          color: "#38bdf8",
        }}
      >
        AI Tech News Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(350px,1fr))",
          gap: "25px",
        }}
      >
        {articles.map((article, index) => (
          <div
            key={index}
            style={{
              background: "#1e293b",
              padding: "20px",
              borderRadius: "16px",
              boxShadow: "0 0 15px rgba(56,189,248,0.2)",
            }}
          >
            <h2
              style={{
                color: "#38bdf8",
                marginBottom: "15px",
                fontSize: "22px",
              }}
            >
              {article.title}
            </h2>

            <p
              style={{
                color: "#e2e8f0",
                lineHeight: "1.7",
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
                background: "#38bdf8",
                color: "#0f172a",
                padding: "10px 18px",
                borderRadius: "8px",
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