// NewsFeed.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Bookmark,
  BookmarkCheck,
  Download,
  Clock3,
  ExternalLink,
} from "lucide-react";

const API_KEY = "7e1b48a2f0a348cf97c75ba2ecf6f6ea";

export default function NewsFeed() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState([]);

  // Load bookmarks
  useEffect(() => {
    const savedBookmarks =
      JSON.parse(localStorage.getItem("bookmarks")) || [];

    setBookmarks(savedBookmarks);
  }, []);

  // Fetch News
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);

      const randomPage = Math.floor(Math.random() * 10) + 1;

      const timestamp = new Date().getTime();

      const query = "technology";

      const encodedQuery = encodeURIComponent(query);

      const url =
        `https://newsapi.org/v2/everything?q=${encodedQuery}` +
        `&domains=indianexpress.com` +
        `&language=en` +
        `&sortBy=publishedAt` +
        `&pageSize=40` +
        `&page=${randomPage}` +
        `&apiKey=${API_KEY}` +
        `&t=${timestamp}`;

      const response = await axios.get(url);

      const formattedArticles = response.data.articles.map(
        (article, index) => ({
          id: `${index}-${Date.now()}`,
          title: article.title,
          description: article.description,
          content: article.content,
          image:
            article.urlToImage ||
            "https://images.unsplash.com/photo-1518770660439-4636190af475",

          url: article.url,

          source: article.source.name,

          summary: generateSummary(
            article.description,
            article.content
          ),

          readingTime: calculateReadingTime(
            article.content || article.description || ""
          ),
        })
      );

      setArticles(formattedArticles);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Small Summary
  const generateSummary = (description, content) => {
    const text = `${description || ""} ${content || ""}`;

    if (!text) {
      return "No summary available.";
    }

    return (
      text.split(" ").slice(0, 35).join(" ") +
      "... Read full article for more details."
    );
  };

  // Reading Time
  const calculateReadingTime = (text) => {
    const words = text.split(" ").length;

    const minutes = Math.ceil(words / 200);

    return `${minutes} min read`;
  };

  // Bookmark
  const toggleBookmark = (article) => {
    const exists = bookmarks.find(
      (item) => item.url === article.url
    );

    let updatedBookmarks;

    if (exists) {
      updatedBookmarks = bookmarks.filter(
        (item) => item.url !== article.url
      );
    } else {
      updatedBookmarks = [...bookmarks, article];
    }

    setBookmarks(updatedBookmarks);

    localStorage.setItem(
      "bookmarks",
      JSON.stringify(updatedBookmarks)
    );
  };

  // Download Summary
  const downloadSummary = (article) => {
    const content = `
Title: ${article.title}

Summary:
${article.summary}

Read Full:
${article.url}
    `;

    const blob = new Blob([content], {
      type: "text/plain",
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = `${article.title}.txt`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  // Loading State
  if (loading) {
    return (
      <div
        style={{
          background: "#020617",
          color: "white",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "28px",
          fontWeight: "bold",
        }}
      >
        Loading Tech News...
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
        }}
      >
        Tech News Articles
      </h1>

      {/* ARTICLES */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(340px,1fr))",
          gap: "25px",
        }}
      >
        {articles.map((article) => {
          const bookmarked = bookmarks.find(
            (item) => item.url === article.url
          );

          return (
            <div
              key={article.id}
              style={{
                background: "#111827",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow:
                  "0px 8px 25px rgba(0,0,0,0.4)",
              }}
            >
              {/* IMAGE */}
              <img
                src={article.image}
                alt="news"
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                }}
              />

              {/* CONTENT */}
              <div style={{ padding: "20px" }}>
                <h2
                  style={{
                    color: "white",
                    fontSize: "22px",
                    marginBottom: "15px",
                    lineHeight: "1.5",
                  }}
                >
                  {article.title}
                </h2>

                {/* SUMMARY */}
                <p
                  style={{
                    color: "#cbd5e1",
                    lineHeight: "1.7",
                    marginBottom: "18px",
                  }}
                >
                  {article.summary}
                </p>

                {/* READING TIME */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#94a3b8",
                    marginBottom: "18px",
                  }}
                >
                  <Clock3 size={18} />
                  <span>{article.readingTime}</span>
                </div>

                {/* BUTTONS */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  {/* READ MORE */}
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: "#2563eb",
                      color: "white",
                      padding: "10px 15px",
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

                  {/* BOOKMARK */}
                  <button
                    onClick={() =>
                      toggleBookmark(article)
                    }
                    style={{
                      background: bookmarked
                        ? "#16a34a"
                        : "#374151",

                      border: "none",
                      color: "white",
                      padding: "10px 15px",
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

                  {/* DOWNLOAD */}
                  <button
                    onClick={() =>
                      downloadSummary(article)
                    }
                    style={{
                      background: "#7c3aed",
                      border: "none",
                      color: "white",
                      padding: "10px 15px",
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

      {/* SAVED ARTICLES */}
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
          <p style={{ color: "#94a3b8" }}>
            No saved articles yet.
          </p>
        ) : (
          bookmarks.map((item, index) => (
            <div
              key={index}
              style={{
                background: "#111827",
                padding: "15px",
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
                  fontSize: "18px",
                  fontWeight: "bold",
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