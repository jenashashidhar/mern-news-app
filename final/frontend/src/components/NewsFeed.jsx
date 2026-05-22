```jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

import {
  Heart,
  Bookmark,
  Share2,
  MessageCircle,
  Clock3,
  Search,
  Cpu,
  ChevronDown,
  ChevronUp,
  Flame,
} from "lucide-react";

const API_KEY = "4f676d614fd34cad91b0fdc8f658cf6c";

export default function NewsFeed() {
  const [articles, setArticles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  const [liked, setLiked] = useState(
    JSON.parse(localStorage.getItem("liked")) || {}
  );

  const [saved, setSaved] = useState(
    JSON.parse(localStorage.getItem("saved")) || {}
  );

  const [comments, setComments] = useState(
    JSON.parse(localStorage.getItem("comments")) || {}
  );

  const [inputComment, setInputComment] = useState({});

  const [loading, setLoading] = useState(true);

  const categories = [
    "All",
    "AI",
    "Cybersecurity",
    "Startups",
    "Gadgets",
    "Robotics",
    "Blockchain",
    "Programming",
  ];

  // Fetch News
  const fetchNews = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=technology OR AI OR gadgets OR cybersecurity OR startups OR robotics OR blockchain&language=en&sortBy=publishedAt&pageSize=50&apiKey=${API_KEY}`
      );

      const news = response.data.articles.map((article, index) => ({
        ...article,
        id: index + Math.random(),
        summary: generateSummary(article),
        readTime: calculateReadTime(
          article.content || article.description || ""
        ),
      }));

      setArticles(news);
      setFiltered(news);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();

    const interval = setInterval(() => {
      fetchNews();
    }, 120000);

    return () => clearInterval(interval);
  }, []);

  // Search
  useEffect(() => {
    const result = articles.filter((article) =>
      article.title?.toLowerCase().includes(search.toLowerCase())
    );

    setFiltered(result);
  }, [search, articles]);

  // AI Summary
  const generateSummary = (article) => {
    const text =
      article.description ||
      article.content ||
      "Technology industry evolving rapidly.";

    return `
🚀 Tech Insight:
${text}

🔥 Major Discovery:
${text.slice(0, 140)}...

📌 Why This Matters:
This development could influence AI systems,
cybersecurity, startups, gadgets, and the future
of global technology innovation.
`;
  };

  // Reading Time
  const calculateReadTime = (text) => {
    const words = text.split(" ").length;
    return Math.max(1, Math.ceil(words / 200));
  };

  // Time Ago
  const timeAgo = (date) => {
    const seconds = Math.floor(
      (new Date() - new Date(date)) / 1000
    );

    let interval = seconds / 3600;

    if (interval < 1) {
      interval = seconds / 60;
      return `${Math.floor(interval)} mins ago`;
    }

    if (interval < 24) {
      return `${Math.floor(interval)} hrs ago`;
    }

    return `${Math.floor(interval / 24)} days ago`;
  };

  // Like
  const toggleLike = (id) => {
    const updated = {
      ...liked,
      [id]: !liked[id],
    };

    setLiked(updated);

    localStorage.setItem(
      "liked",
      JSON.stringify(updated)
    );
  };

  // Save Bookmark
  const toggleSave = (id) => {
    const updated = {
      ...saved,
      [id]: !saved[id],
    };

    setSaved(updated);

    localStorage.setItem(
      "saved",
      JSON.stringify(updated)
    );
  };

  // Share
  const shareArticle = async (article) => {
    try {
      await navigator.share({
        title: article.title,
        text: article.description,
        url: article.url,
      });
    } catch (err) {
      console.log(err);
    }
  };

  // Add Comment
  const addComment = (id) => {
    if (!inputComment[id]) return;

    const updated = {
      ...comments,
      [id]: [...(comments[id] || []), inputComment[id]],
    };

    setComments(updated);

    localStorage.setItem(
      "comments",
      JSON.stringify(updated)
    );

    setInputComment({
      ...inputComment,
      [id]: "",
    });
  };

  // Category Filter
  const filterCategory = (category) => {
    if (category === "All") {
      setFiltered(articles);
    } else {
      const filteredNews = articles.filter((article) =>
        article.title
          ?.toLowerCase()
          .includes(category.toLowerCase())
      );

      setFiltered(filteredNews);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#020617] min-h-screen flex justify-center items-center text-white text-3xl font-bold">
        Loading Tech Radar Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-5 mb-8">
        <div className="flex items-center gap-3">
          <Cpu
            className="text-cyan-400"
            size={42}
          />

          <h1 className="text-4xl font-bold text-cyan-400">
            Tech Radar Dashboard
          </h1>
        </div>

        {/* Search */}
        <div className="flex items-center bg-[#0f172a] border border-cyan-500 rounded-xl px-4 py-3 w-full md:w-[400px]">
          <Search className="text-gray-400" />

          <input
            type="text"
            placeholder="Search technology news..."
            className="bg-transparent outline-none text-white ml-3 w-full"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>
      </div>

      {/* Trending */}
      <div className="flex items-center gap-2 mb-5">
        <Flame className="text-orange-400" />

        <h2 className="text-2xl font-semibold text-white">
          Trending Technology News
        </h2>
      </div>

      {/* Categories */}
      <div className="flex gap-3 flex-wrap mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() =>
              filterCategory(cat)
            }
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-xl transition-all"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Infinite Scroll */}
      <InfiniteScroll
        dataLength={filtered.length}
        next={fetchNews}
        hasMore={true}
        loader={
          <h4 className="text-center text-white mt-10">
            Loading more articles...
          </h4>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((article) => (
            <div
              key={article.id}
              className="bg-[#0f172a] rounded-2xl overflow-hidden shadow-lg hover:scale-[1.03] hover:shadow-cyan-500/30 transition-all duration-300 border border-[#1e293b]"
            >
              {/* Image */}
              <img
                src={
                  article.urlToImage ||
                  "https://images.unsplash.com/photo-1518770660439-4636190af475"
                }
                alt="news"
                className="w-full h-56 object-cover"
              />

              <div className="p-5">
                {/* Source + Time */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-cyan-400 text-sm font-semibold">
                    {article.source.name}
                  </span>

                  <span className="text-gray-400 text-xs">
                    {timeAgo(article.publishedAt)}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-white mb-3 line-clamp-2">
                  {article.title}
                </h2>

                {/* Reading Time */}
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                  <Clock3 size={16} />
                  {article.readTime} min read
                </div>

                {/* Summary */}
                <p className="text-gray-300 text-sm whitespace-pre-line">
                  {expanded === article.id
                    ? article.summary
                    : `${article.summary.slice(
                        0,
                        180
                      )}...`}
                </p>

                {/* Expand */}
                <button
                  onClick={() =>
                    setExpanded(
                      expanded === article.id
                        ? null
                        : article.id
                    )
                  }
                  className="text-cyan-400 mt-2 flex items-center gap-1"
                >
                  {expanded === article.id ? (
                    <>
                      Show Less{" "}
                      <ChevronUp size={16} />
                    </>
                  ) : (
                    <>
                      Read More{" "}
                      <ChevronDown size={16} />
                    </>
                  )}
                </button>

                {/* Actions */}
                <div className="flex justify-between items-center mt-5">
                  <button
                    onClick={() =>
                      toggleLike(article.id)
                    }
                    className={`${
                      liked[article.id]
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  >
                    <Heart size={22} />
                  </button>

                  <button
                    onClick={() =>
                      toggleSave(article.id)
                    }
                    className={`${
                      saved[article.id]
                        ? "text-yellow-400"
                        : "text-gray-400"
                    }`}
                  >
                    <Bookmark size={22} />
                  </button>

                  <button
                    onClick={() =>
                      shareArticle(article)
                    }
                    className="text-gray-400"
                  >
                    <Share2 size={22} />
                  </button>
                </div>

                {/* Comments */}
                <div className="mt-5">
                  <div className="flex items-center gap-2 text-cyan-400 mb-2">
                    <MessageCircle size={18} />
                    Comments
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={
                        inputComment[
                          article.id
                        ] || ""
                      }
                      onChange={(e) =>
                        setInputComment({
                          ...inputComment,
                          [article.id]:
                            e.target.value,
                        })
                      }
                      className="flex-1 bg-[#1e293b] text-white p-2 rounded-lg outline-none"
                    />

                    <button
                      onClick={() =>
                        addComment(article.id)
                      }
                      className="bg-cyan-500 px-4 rounded-lg text-white"
                    >
                      Post
                    </button>
                  </div>

                  {/* Comment List */}
                  <div className="space-y-2 mt-3">
                    {(comments[article.id] || []).map(
                      (comment, index) => (
                        <div
                          key={index}
                          className="bg-[#1e293b] text-gray-200 p-2 rounded-lg text-sm"
                        >
                          {comment}
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Read Full Article */}
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-5 bg-cyan-500 hover:bg-cyan-600 text-white text-center py-3 rounded-xl font-semibold transition-all"
                >
                  Read Full Article
                </a>
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
```
