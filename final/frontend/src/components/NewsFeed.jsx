import React, { useEffect, useState } from "react";
import axios from "axios";

export default function NewsFeed() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = "YOUR_NEWSAPI_KEY";

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=15&apiKey=${API_KEY}`
      );

      setArticles(res.data.articles || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#0f172a",
        minHeight: "100vh",
        color: "white",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      {/* MAIN LAYOUT */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 1fr",
          gap: "20px",
        }}
      >
        {/* LEFT SIDE */}
        <div>
          {/* HEADER */}
          <div
            style={{
              background: "#111827",
              border: "1px solid #334155",
              borderRadius: "20px",
              padding: "25px",
              marginBottom: "20px",
            }}
          >
            <h1
              style={{
                color: "#38bdf8",
                marginBottom: "10px",
                fontSize: "40px",
              }}
            >
              ⚡ Tech Radar
            </h1>

            <p style={{ color: "#cbd5e1" }}>
              Live technology news from around the world
            </p>
          </div>

          {/* LIVE UPDATES */}
          <div
            style={{
              background: "#111827",
              border: "1px solid #334155",
              borderRadius: "20px",
              padding: "20px",
            }}
          >
            <h2
              style={{
                marginBottom: "20px",
                color: "#f472b6",
              }}
            >
              ● Live Updates
            </h2>

            {loading ? (
              <h3>Loading latest tech news...</h3>
            ) : articles.length === 0 ? (
              <h3>No news articles found.</h3>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "20px",
                }}
              >
                {articles.map((article, index) => (
                  <div
                    key={index}
                    style={{
                      background: "#1e293b",
                      borderRadius: "18px",
                      overflow: "hidden",
                      boxShadow: "0 0 10px rgba(0,0,0,0.3)",
                    }}
                  >
                    {article.urlToImage && (
                      <img
                        src={article.urlToImage}
                        alt="news"
                        style={{
                          width: "100%",
                          height: "250px",
                          objectFit: "cover",
                        }}
                      />
                    )}

                    <div style={{ padding: "20px" }}>
                      <h2
                        style={{
                          marginBottom: "10px",
                          fontSize: "24px",
                        }}
                      >
                        {article.title}
                      </h2>

                      <p
                        style={{
                          color: "#cbd5e1",
                          marginBottom: "15px",
                          lineHeight: "1.6",
                        }}
                      >
                        {article.description ||
                          "No description available"}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            color: "#38bdf8",
                            fontSize: "14px",
                          }}
                        >
                          {article.source.name}
                        </span>

                        <a
                          href={article.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            background: "#38bdf8",
                            color: "black",
                            padding: "10px 18px",
                            borderRadius: "10px",
                            textDecoration: "none",
                            fontWeight: "bold",
                          }}
                        >
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div>
          {/* INFLUENCERS */}
          <div
            style={{
              background: "#111827",
              border: "1px solid #334155",
              borderRadius: "20px",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            <h2
              style={{
                color: "#38bdf8",
                marginBottom: "20px",
              }}
            >
              Top Influencers
            </h2>

            {["Elon Musk", "Sam Altman", "Sundar Pichai"].map(
              (person, index) => (
                <button
                  key={index}
                  style={{
                    width: "100%",
                    padding: "14px",
                    marginBottom: "12px",
                    borderRadius: "12px",
                    border: "none",
                    background: "#38bdf8",
                    color: "black",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  {person}
                </button>
              )
            )}
          </div>

          {/* DISCOVERIES */}
          <div
            style={{
              background: "#111827",
              border: "1px solid #334155",
              borderRadius: "20px",
              padding: "20px",
            }}
          >
            <h2
              style={{
                color: "#f472b6",
                marginBottom: "15px",
              }}
            >
              Major Tech Discoveries
            </h2>

            <ul
              style={{
                color: "#cbd5e1",
                lineHeight: "2",
                paddingLeft: "20px",
              }}
            >
              <li>AI agents replacing apps</li>
              <li>Quantum computing progress</li>
              <li>Humanoid robots</li>
              <li>OpenAI new multimodal AI</li>
              <li>Google Gemini upgrades</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}