// NewsFeed.jsx

import React, { useEffect, useState } from "react";
import {
  Bookmark,
  BookmarkCheck,
  Download,
  Clock3,
  ExternalLink,
  Share2,
  Heart,
} from "lucide-react";

const API_KEY = "7e1b48a2f0a348cf97c75ba2ecf6f6ea";

export default function NewsFeed() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState([]);
  const [likedArticles, setLikedArticles] = useState([]);

  // Load bookmarks
  useEffect(() => {
    const savedBookmarks =
      JSON.parse(localStorage.getItem("bookmarks")) || [];

    const savedLikes = JSON.parse(localStorage.getItem("likes")) || [];

    setBookmarks(savedBookmarks);
    setLikedArticles(savedLikes);
  }, []);

  // Fetch fresh articles every refresh
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);

      // Random page for fresh articles
      const randomPage = Math.floor(Math.random() * 5) + 1;

      const response = await fetch(
        `https://newsapi.org/v2/everything?q=technology&domains=indianexpress.com&language=en&sortBy=publishedAt&pageSize=15&page=${randomPage}&apiKey=${API_KEY}`
      );

      const data = await response.json();

      const formatted = data.articles.map((article, index) => ({
        id: `${index}-${Date.now()}`,
        title: article.title,
        description: article.description,
        content: article.content,
        image: article.urlToImage,
        url: article.url,
        source: article.source.name,
        publishedAt: article.publishedAt,
        summary: generateSummary(article.description || article.content),
        readingTime: calculateReadingTime(
          article.content || article.description || ""
        ),
      }));

      setArticles(formatted);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Better summary
  const generateSummary = (text) => {
    if (!text) return "No summary available.";

    return (
      text.split(" ").slice(0, 25).join(" ") +
      "... Read more for complete details."
    );
  };

  // Reading time
  const calculateReadingTime = (text) => {
    const words = text.split(" ").length;
    const minutes = Math.ceil(words / 200);

    return `${minutes} min read`;
  };

  // Bookmark
  const toggleBookmark = (article) => {
    const exists = bookmarks.find((item) => item.url === article.url);

    let updated;

    if (exists) {
      updated = bookmarks.filter((item) => item.url !== article.url);
    } else {
      updated = [...bookmarks, article];
    }

    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
  };

  // Like article
  const toggleLike = (article) => {
    const exists = likedArticles.find((item) => item.url === article.url);

    let updated;

    if (exists) {
      updated = likedArticles.filter((item) => item.url !== article.url);
    } else {
      updated = [...likedArticles, article];
    }

    setLikedArticles(updated);
    localStorage.setItem("likes", JSON.stringify(updated));
  };

  // Share article
  const shareArticle = async (article) => {
    try {
      await navigator.share({
        title: article.title,
        text: article.summary,
        url: article.url,
      });
    } catch (error) {
      console.log("Sharing failed");
    }
  };

  // Download article
  const downloadArticle = (article) => {
    const content = `
Title: ${article.title}

Summary:
${article.summary}

Reading Time:
${article.readingTime}

Read Full:
${article.url}
    `;

    const blob = new Blob([content], { type: "text/plain" });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = `${article.title}.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div
        style={{
          background: "#020617",
          minHeight: "100vh",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "28px",
          fontWeight: "bold",
        }}
      >
        Loading Latest Tech News...
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#020617",
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      <h1
        style={{
          color: "white",
          textAlign: "center",
          marginBottom: "40px",
          fontSize: "42px",
          fontWeight: "bold",
        }}
      >
        Tech News Hub
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(330px,1fr))",
          gap: "28px",
        }}
      >
        {articles.map((article) => {
          const bookmarked = bookmarks.find(
            (item) => item.url === article.url
          );

          const liked = likedArticles.find(
            (item) => item.url === article.url
          );

          return (
            <div
              key={article.id}
              style={{
                background: "#111827",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
                transition: "0.3s",
              }}
            >
              <img
                src={
                  article.image ||
                  "https://images.unsplash.com/photo-1518770660439-4636190af475"
                }
                alt="news"
                style={{
                  width: "100%",
                  height: "230px",
                  objectFit: "cover",
                }}
              />

              <div style={{ padding: "20px" }}>
                <h2
                  style={{
                    color: "white",
                    fontSize: "23px",
                    marginBottom: "14px",
                    lineHeight: "1.4",
                  }}
                >
                  {article.title}
                </h2>

                <p
                  style={{
                    color: "#cbd5e1",
                    lineHeight: "1.7",
                    fontSize: "15px",
                    marginBottom: "18px",
                  }}
                >
                  {article.summary}
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#94a3b8",
                    marginBottom: "20px",
                  }}
                >
                  <Clock3 size={18} />
                  <span>{article.readingTime}</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  {/* Read More */}
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: "#2563eb",
                      color: "white",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontWeight: "bold",
                    }}
                  >
                    Read More
                    <ExternalLink size={16} />
                  </a>

                  {/* Save */}
                  <button
                    onClick={() => toggleBookmark(article)}
                    style={{
                      background: bookmarked ? "#16a34a" : "#334155",
                      border: "none",
                      color: "white",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {bookmarked ? (
                      <BookmarkCheck size={18} />
                    ) : (
                      <Bookmark size={18} />
                    )}

                    Save
                  </button>

                  {/* Like */}
                  <button
                    onClick={() => toggleLike(article)}
                    style={{
                      background: liked ? "#dc2626" : "#334155",
                      border: "none",
                      color: "white",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Heart size={18} />
                    Like
                  </button>

                  {/* Share */}
                  <button
                    onClick={() => shareArticle(article)}
                    style={{
                      background: "#0891b2",
                      border: "none",
                      color: "white",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Share2 size={18} />
                    Share
                  </button>

                  {/* Download */}
                  <button
                    onClick={() => downloadArticle(article)}
                    style={{
                      background: "#7c3aed",
                      border: "none",
                      color: "white",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Download size={18} />
                    Download
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Saved Articles */}
      <div style={{ marginTop: "60px" }}>
        <h2
          style={{
            color: "white",
            marginBottom: "20px",
            fontSize: "32px",
          }}
        >
          Saved Articles
        </h2>

        {bookmarks.length === 0 ? (
          <p style={{ color: "#94a3b8" }}>No saved articles.</p>
        ) : (
          bookmarks.map((item, index) => (
            <div
              key={index}
              style={{
                background: "#111827",
                padding: "16px",
                borderRadius: "12px",
                marginBottom: "12px",
              }}
            >
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "#60a5fa",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                {item.title}
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}