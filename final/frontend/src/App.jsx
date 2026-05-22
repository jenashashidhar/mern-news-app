// NewsFeed.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Heart,
  Bookmark,
  BookmarkCheck,
  MessageCircle,
  ExternalLink,
  Clock3,
} from "lucide-react";

const API_KEY = "7e1b48a2f0a348cf97c75ba2ecf6f6ea";

export default function NewsFeed() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [likedArticles, setLikedArticles] = useState(
    JSON.parse(localStorage.getItem("likedArticles")) || []
  );

  const [bookmarks, setBookmarks] = useState(
    JSON.parse(localStorage.getItem("bookmarks")) || []
  );

  const [comments, setComments] = useState({});

  useEffect(() => {
    fetchNews();
  }, []);

  // FETCH INDIAN EXPRESS ARTICLES
  const fetchNews = async () => {
    try {
      setLoading(true);

      // Random page each refresh for new articles
      const randomPage = Math.floor(Math.random() * 5) + 1;

      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=technology&domains=indianexpress.com&pageSize=45&page=${randomPage}&sortBy=publishedAt&language=en&apiKey=${API_KEY}`
      );

      const formattedArticles = response.data.articles.map(
        (article, index) => ({
          id: index + Date.now(),
          title: article.title,
          description: article.description,
          content: article.content,
          image:
            article.urlToImage ||
            "https://images.unsplash.com/photo-1518770660439-4636190af475",
          url: article.url,
          publishedAt: article.publishedAt,
          source: article.source.name,

          // BETTER SUMMARY
          summary: createSummary(
            article.description,
            article.content
          ),

          // READING TIME
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

  // AI-LIKE SUMMARY
  const createSummary = (description, content) => {
    const text = `${description || ""} ${content || ""}`;

    if (!text)
      return "Detailed article summary unavailable.";

    const words = text.split(" ");

    const shortSummary = words.slice(0, 35).join(" ");

    return `${shortSummary}... Read full article on Indian Express for complete insights and updates.`;
  };

  // READING TIME
  const calculateReadingTime = (text) => {
    const words = text.split(" ").length;

    const minutes = Math.ceil(words / 200);

    return `${minutes} min read`;
  };

  // LIKE
  const toggleLike = (article) => {
    const exists = likedArticles.find(
      (item) => item.url === article.url
    );

    let updatedLikes;

    if (exists) {
      updatedLikes = likedArticles.filter(
        (item) => item.url !== article.url
      );
    } else {
      updatedLikes = [...likedArticles, article];
    }

    setLikedArticles(updatedLikes);

    localStorage.setItem(
      "likedArticles",
      JSON.stringify(updatedLikes)
    );
  };

  // BOOKMARK
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

  // COMMENTS
  const handleComment = (articleId, text) => {
    setComments({
      ...comments,
      [articleId]: text,
    });
  };

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
          fontSize: "30px",
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
          fontSize: "42px",
          marginBottom: "40px",
        }}
      >
        Indian Express Tech News
      </h1>

      {/* ARTICLES */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(350px,1fr))",
          gap: "25px",
        }}
      >
        {articles.map((article) => {
          const liked = likedArticles.find(
            (item) => item.url === article.url
          );

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
                  "0px 8px 30px rgba(0,0,0,0.4)",
              }}
            >
              {/* IMAGE */}
              <img
                src={article.image}
                alt="news"
                style={{
                  width: "100%",
                  height: "230px",
                  objectFit: "cover",
                }}
              />

              {/* CONTENT */}
              <div style={{ padding: "20px" }}>
                <h2
                  style={{
                    color: "white",
                    fontSize: "23px",
                    marginBottom: "15px",
                    lineHeight: "1.4",
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
                    fontSize: "15px",
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
                    marginBottom: "20px",
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
                    marginBottom: "15px",
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
                    Read Full
                    <ExternalLink size={16} />
                  </a>

                  {/* LIKE */}
                  <button
                    onClick={() => toggleLike(article)}
                    style={{
                      background: liked
                        ? "#dc2626"
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
                    <Heart size={18} />
                    Like
                  </button>

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
                </div>

                {/* COMMENTS */}
                <div
                  style={{
                    background: "#1f2937",
                    padding: "12px",
                    borderRadius: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginBottom: "10px",
                      color: "white",
                    }}
                  >
                    <MessageCircle size={18} />
                    Comments
                  </div>

                  <textarea
                    placeholder="Write your thoughts..."
                    value={comments[article.id] || ""}
                    onChange={(e) =>
                      handleComment(
                        article.id,
                        e.target.value
                      )
                    }
                    style={{
                      width: "100%",
                      minHeight: "80px",
                      background: "#111827",
                      border: "none",
                      outline: "none",
                      color: "white",
                      padding: "10px",
                      borderRadius: "10px",
                      resize: "none",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}