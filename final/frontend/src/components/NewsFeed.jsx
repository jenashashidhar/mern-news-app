import React, { useEffect, useState } from "react";
import axios from "axios";

export default function NewsFeed() {
  const API_KEY = "4f676d614fd34cad91b0fdc8f658cf6c"; // ← replace with your key

  const [articles, setArticles] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=15&apiKey=${API_KEY}`
      );

      if (res.data.status === "ok" && Array.isArray(res.data.articles)) {
        setArticles(res.data.articles);
        setError(null);
      } else {
        setArticles([]);
        setError("Invalid response from NewsAPI.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load news.");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return "Just now";
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    return date.toLocaleDateString();
  };

  const toggleBookmark = (article) => {
    const id = article.url;
    const isBookmarked = bookmarks.some((a) => a.url === id);

    let newBookmarks;
    if (isBookmarked) {
      newBookmarks = bookmarks.filter((a) => a.url !== id);
    } else {
      newBookmarks = [article, ...bookmarks];
    }

    setBookmarks(newBookmarks);
    localStorage.setItem("techNewsBookmarks", JSON.stringify(newBookmarks));
  };

  const isBookmarked = (article) => bookmarks.some((a) => a.url === article.url);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("techNewsBookmarks");
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch {}
    }
    fetchNews();
  }, []);

  return (
    <div
      style={{
        background: "radial-gradient(circle at 20% 30%, #1e1b4b, #0f172a 70%)",
        minHeight: "100vh",
        color: "#cbd5e1",
        padding: "16px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* MAIN LAYOUT */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 1fr",
          gap: "20px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* LEFT SIDE — Live Updates */}
        <div>
          {/* HEADER */}
          <div
            style={{
              backdropFilter: "blur(12px)",
              background: "rgba(17, 24, 39, 0.7)",
              border: "1px solid rgba(51, 65, 85, 0.5)",
              borderRadius: "24px",
              padding: "28px",
              marginBottom: "24px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              transition: "transform 0.2s ease",
            }}
          >
            <h1
              style={{
                color: "#a5f3fc",
                marginBottom: "8px",
                fontSize: "2.8rem",
                fontWeight: "bold",
                letterSpacing: "-0.5px",
              }}
            >
              ⚡ Tech Radar
            </h1>
            <p style={{ color: "#e2e8f0", fontSize: "1rem" }}>
              Live technology news from around the world
            </p>
          </div>

          {/* LIVE UPDATES */}
          <div
            style={{
              backdropFilter: "blur(10px)",
              background: "rgba(17, 24, 39, 0.7)",
              border: "1px solid rgba(51, 65, 85, 0.5)",
              borderRadius: "24px",
              padding: "24px",
              overflow: "auto",
              maxHeight: "80vh",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h2
                style={{
                  color: "#f472b6",
                  marginBottom: "0",
                  fontSize: "1.5rem",
                  fontWeight: "600",
                }}
              >
                ● Live Updates
              </h2>
              <button
                onClick={fetchNews}
                disabled={loading}
                style={{
                  background: "rgba(147, 51, 234, 0.8)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "16px",
                  padding: "8px 18px",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                {loading ? "Refreshing…" : "Refresh"}
              </button>
            </div>

            {loading && (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#a5f3fc",
                }}
              >
                <div style={{ fontSize: "1.2rem", marginBottom: "12px" }}>
                  Loading latest tech news...
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background: "#a5f3fc",
                        opacity: 0.6,
                        animation: `bounce 1.2s infinite ${i * 0.2}s ease-in-out`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {!loading && error && (
              <div
                style={{
                  padding: "20px",
                  background: "rgba(185, 28, 28, 0.2)",
                  border: "1px solid #b91c1c",
                  borderRadius: "16px",
                  color: "#fca5a5",
                  textAlign: "center",
                  marginBottom: "16px",
                }}
              >
                <strong>Error:</strong> {error}
              </div>
            )}

            {!loading && !error && articles.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#a5f3fc",
                  fontSize: "1.1rem",
                }}
              >
                No articles found. Try again or check your API key.
              </div>
            )}

            {!loading && articles.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "20px",
                }}
              >
                {articles.map((article, index) => (
                  <div
                    key={article.url}
                    style={{
                      background: "rgba(30, 41, 59, 0.9)",
                      borderRadius: "20px",
                      border: "1px solid rgba(79, 70, 229, 0.3)",
                      overflow: "hidden",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                      transform: "translateY(0)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow =
                        "0 16px 32px rgba(88, 28, 135, 0.35)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "";
                      e.currentTarget.style.boxShadow = "";
                    }}
                    onClick={() => {
                      if (article.url) {
                        window.open(article.url, "_blank", "noreferrer");
                      }
                    }}
                  >
                    {article.urlToImage && (
                      <img
                        src={article.urlToImage}
                        alt={article.title}
                        style={{
                          width: "100%",
                          height: "220px",
                          objectFit: "cover",
                          borderBottom: "1px solid rgba(124, 58, 237, 0.2)",
                        }}
                      />
                    )}

                    <div style={{ padding: "20px" }}>
                      <h2
                        style={{
                          marginBottom: "10px",
                          fontSize: "1.15rem",
                          fontWeight: "600",
                          color: "#e2e8f0",
                        }}
                      >
                        {article.title}
                      </h2>

                      <p
                        style={{
                          color: "#cbd5e1",
                          marginBottom: "16px",
                          lineHeight: "1.6",
                          fontSize: "0.95rem",
                        }}
                      >
                        {article.description || "No description available"}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontSize: "0.85rem",
                          }}
                        >
                          <span
                            style={{
                              color: "#a5f3fc",
                              fontWeight: "600",
                            }}
                          >
                            {article.source?.name || "Unknown source"}
                          </span>
                          <span
                            style={{
                              fontSize: "0.8rem",
                              color: "#9ca3af",
                            }}
                          >
                            • {formatTime(article.publishedAt)}
                          </span>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(article);
                            }}
                            style={{
                              background: isBookmarked(article)
                                ? "rgba(147, 51, 234, 0.8)"
                                : "rgba(56, 189, 248, 0.6)",
                              color: "#0f172a",
                              border: "none",
                              borderRadius: "999px",
                              padding: "6px 14px",
                              fontSize: "0.8rem",
                              fontWeight: "600",
                              cursor: "pointer",
                              transition: "background 0.2s",
                            }}
                          >
                            {isBookmarked(article) ? "Saved" : "Save"}
                          </button>
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              background: "rgba(56, 189, 248, 0.8)",
                              color: "black",
                              padding: "8px 16px",
                              borderRadius: "16px",
                              textDecoration: "none",
                              fontSize: "0.85rem",
                              fontWeight: "600",
                              transition: "background 0.2s",
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Read More
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Top Influencers */}
          <div
            style={{
              backdropFilter: "blur(10px)",
              background: "rgba(17, 24, 39, 0.7)",
              border: "1px solid rgba(51, 65, 85, 0.5)",
              borderRadius: "24px",
              padding: "24px",
            }}
          >
            <h2
              style={{
                color: "#a5f3fc",
                marginBottom: "20px",
                fontSize: "1.3rem",
              }}
            >
              Top Tech Influencers
            </h2>

            {["Elon Musk", "Sam Altman", "Sundar Pichai", "Jensen Huang", "Mark Zuckerberg"].map(
              (person) => (
                <button
                  key={person}
                  style={{
                    width: "100%",
                    padding: "14px",
                    marginBottom: "10px",
                    borderRadius: "16px",
                    border: "1px solid rgba(147, 51, 234, 0.4)",
                    background: "rgba(147, 51, 234, 0.15)",
                    color: "#e2e8f0",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "background 0.2s, transform 0.1s",
                    fontSize: "0.9rem",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(147, 51, 234, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(147, 51, 234, 0.15)";
                  }}
                >
                  {person}
                </button>
              )
            )}
          </div>

          {/* Major Tech Discoveries */}
          <div
            style={{
              backdropFilter: "blur(10px)",
              background: "rgba(17, 24, 39, 0.7)",
              border: "1px solid rgba(51, 65, 85, 0.5)",
              borderRadius: "24px",
              padding: "24px",
            }}
          >
            <h2
              style={{
                color: "#f472b6",
                marginBottom: "16px",
                fontSize: "1.3rem",
              }}
            >
              Major Tech Discoveries
            </h2>

            <ul
              style={{
                color: "#cbd5e1",
                lineHeight: "2",
                paddingLeft: "20px",
                margin: "0",
                fontSize: "0.9rem",
              }}
            >
              <li>AI agents replacing apps</li>
              <li>Breakthroughs in quantum computing</li>
              <li>Huge progress in humanoid robots</li>
              <li>OpenAI’s new multimodal AI models</li>
              <li>Google Gemini upgraded to real‑time</li>
            </ul>
          </div>

          {/* Trending AI Topics */}
          <div
            style={{
              backdropFilter: "blur(10px)",
              background: "rgba(17, 24, 39, 0.7)",
              border: "1px solid rgba(51, 65, 85, 0.5)",
              borderRadius: "24px",
              padding: "24px",
            }}
          >
            <h2
              style={{
                color: "#a78bfa",
                marginBottom: "16px",
                fontSize: "1.3rem",
              }}
            >
              Trending AI Topics
            </h2>

            <ul
              style={{
                color: "#cbd5e1",
                lineHeight: "2",
                paddingLeft: "20px",
                margin: "0",
                fontSize: "0.9rem",
              }}
            >
              <li>Agentic AI workflows</li>
              <li>Open‑source large language models</li>
              <li>AI‑powered code assistants</li>
              <li>Real‑time multimodal AI</li>
              <li>AI ethics & regulation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Global CSS-style animation (you can move this to stylesheet if preferred) */}
      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(1) translateY(0);
            opacity: 0.6;
          }
          40% {
            transform: scale(1.1) translateY(-4px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}