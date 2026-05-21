import React, { useEffect, useState } from "react";
import axios from "axios";

export default function NewsFeed() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = "7e1b48a2f0a348cf97c75ba2ecf6f6ea";

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/top-headlines?country=us&category=technology&pageSize=20&apiKey=${API_KEY}`
      );

      const news = response.data.articles.map((article) => ({
        ...article,
        summary: generateSummary(article),
      }));

      setArticles(news);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching news:", error);
      setLoading(false);
    }
  };

  const generateSummary = (article) => {
    const text =
      article.description ||
      article.content ||
      "No summary available.";

    return text.length > 180
      ? text.substring(0, 180) + "..."
      : text;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>
        🚀 Tech Discoveries News Feed
      </h1>

      {loading ? (
        <div style={styles.loaderContainer}>
          <div style={styles.loader}></div>
          <h2 style={styles.loadingText}>Loading Latest News...</h2>
        </div>
      ) : (
        <div style={styles.grid}>
          {articles.map((article, index) => (
            <div key={index} style={styles.card}>
              <img
                src={
                  article.urlToImage ||
                  "https://via.placeholder.com/400x220"
                }
                alt="news"
                style={styles.image}
              />

              <div style={styles.content}>
                <div style={styles.sourceBox}>
                  {article.source?.name}
                </div>

                <h2 style={styles.title}>
                  {article.title}
                </h2>

                <p style={styles.summary}>
                  {article.summary}
                </p>

                <div style={styles.footer}>
                  <button
                    style={styles.button}
                    onClick={() =>
                      window.open(article.url, "_blank")
                    }
                  >
                    Read Full Article →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background:
      "linear-gradient(to right, #020617, #0f172a, #1e293b)",
    padding: "30px",
    fontFamily: "Arial, sans-serif",
  },

  heading: {
    textAlign: "center",
    color: "white",
    fontSize: "48px",
    marginBottom: "40px",
    fontWeight: "bold",
    textShadow: "0px 0px 10px rgba(56,189,248,0.8)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))",
    gap: "30px",
  },

  card: {
    background: "#111827",
    borderRadius: "22px",
    overflow: "hidden",
    boxShadow: "0 0 20px rgba(0,0,0,0.5)",
    transition: "0.3s ease",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  image: {
    width: "100%",
    height: "240px",
    objectFit: "cover",
  },

  content: {
    padding: "22px",
  },

  sourceBox: {
    display: "inline-block",
    background: "#38bdf8",
    color: "white",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    marginBottom: "14px",
    fontWeight: "bold",
  },

  title: {
    color: "white",
    fontSize: "24px",
    marginBottom: "16px",
    lineHeight: "1.4",
  },

  summary: {
    color: "#cbd5e1",
    fontSize: "16px",
    lineHeight: "1.7",
    marginBottom: "25px",
  },

  footer: {
    display: "flex",
    justifyContent: "center",
  },

  button: {
    background:
      "linear-gradient(to right, #0ea5e9, #38bdf8)",
    color: "white",
    border: "none",
    padding: "14px 22px",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
    transition: "0.3s",
  },

  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "120px",
  },

  loader: {
    width: "70px",
    height: "70px",
    border: "7px solid #334155",
    borderTop: "7px solid #38bdf8",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    color: "white",
    marginTop: "20px",
    fontSize: "24px",
  },
};