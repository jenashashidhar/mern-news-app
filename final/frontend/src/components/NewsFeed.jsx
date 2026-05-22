```jsx
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
  const [expandedSummary, setExpandedSummary] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  // FETCH NEWS
  const fetchNews = async () => {
    try {
      setLoading(true);

      // Random page for fresh articles
      const randomPage = Math.floor(Math.random() * 10) + 1;

      // Prevent caching
      const timestamp = new Date().getTime();

      // QUERY
      const query =
        "technology OR AI OR gadgets OR cybersecurity OR startups OR robotics OR blockchain";

      // API CALL
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          query
        )}&domains=indianexpress.com&language=en&sortBy=publishedAt&pageSize=50&page=${randomPage}&apiKey=${API_KEY}&t=${timestamp}`
      );

      const formattedArticles = response.data.articles.map(
        (article, index) => ({
          id: `${index}-${Date.now()}`,
          title: article.title,
          description: article.description,
          content: article.content,
          image:
            article.urlToImage ||
            "https://images.unsplash.com/photo-1518770660439-4636190af475",

          // Direct Indian Express link
          url: article.url,

          source: article.source.name,

          publishedAt: new Date(
            article.publishedAt
          ).toLocaleDateString(),

          // AI-like summary
          summary: generateAISummary(
            article.title,
            article.description,
            article.content
          ),

          // Reading time
          readingTime: calculateReadingTime(
            article.content || article.description || ""
          ),
        })
      );

      // Shuffle articles
      const shuffled = formattedArticles.sort(
        () => Math.random() - 0.5
      );

      setArticles(shuffled);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // AI SUMMARY
  const generateAISummary = (
    title,
    description,
    content
  ) => {
    const text = `
      ${title || ""}
      ${description || ""}
      ${content || ""}
    `;

    if (!text) {
      return "No detailed summary available.";
    }

    const words = text.split(" ");

    const shortSummary = words
      .slice(0, 45)
      .join(" ");

    return `
${shortSummary}...

Key Takeaway:
This update highlights important developments in technology, innovation, startups, and the digital ecosystem.
    `;
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
                <p
                  style={{
                    color: "#38bdf8",
                    marginBottom: "10px",
                    fontWeight: "bold",
                  }}
                >
                  {article.source}
                </p>

                <h2
                  style={{
                    color: "white",
                    fontSize: "24px",
                    marginBottom: "15px",
                    lineHeight: "1.5",
                  }}
                >
                  {article.title}
                </h2>

                {/* DATE */}
                <p
                  style={{
                    color: "#94a3b8",
                    marginBottom: "15px",
                  }}
                >
                  {article.publishedAt}
                </p>

                {/* SUMMARY */}
                <p
                  style={{
                    color: "#cbd5e1",
                    lineHeight: "1.7",
                    marginBottom: "15px",
                  }}
                >
                  {expandedSummary === article.id
                    ? article.summary
                    : article.summary.slice(0, 120) +
                      "..."}
                </p>

                {/* AI SUMMARY BUTTON */}
                <button
                  onClick={() =>
                    setExpandedSummary(
                      expandedSummary === article.id
                        ? null
                        : article.id
                    )
                  }
                  style={{
                    background: "#06b6d4",
                    border: "none",
                    color: "white",
                    padding: "10px 15px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    marginBottom: "15px",
                    fontWeight: "bold",
                  }}
                >
                  {expandedSummary === article.id
                    ? "Hide Summary"
                    : "AI Summary"}
                </button>

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
                  {/* READ ARTICLE */}
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: "#7c3aed",
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
                    Read Article
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
```
