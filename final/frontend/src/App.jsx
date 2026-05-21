import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsFeed from './components/NewsFeed';
import DashboardCharts from './components/DashboardCharts';
import MarketSurvey from './components/MarketSurvey';
import DiscoveriesTimeline from './components/DiscoveriesTimeline';
import { Activity } from 'lucide-react';

function App() {

  const [articles, setArticles] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {

    const fetchNews = async () => {

      try {

        // Backend API URL
        const res = await axios.get(
          'https://mern-news-appfinal.onrender.com/api/news'
        );

        setArticles(res.data.articles || []);

      } catch (error) {

        console.error("Error fetching news:", error);

      } finally {

        setNewsLoading(false);

      }
    };

    fetchNews();

  }, []);

  return (

    <div className="app-container">

      {/* Main Content */}
      <main className="main-content">

        {/* Header */}
        <header
          className="glass-panel"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
        >

          <Activity
            size={32}
            color="var(--accent-cyan)"
          />

          <div>

            <div className="header-subtitle">
              REAL-TIME DATA
            </div>

            <h1 className="header-title">
              Tech Radar
            </h1>

            <p style={{ color: 'var(--text-secondary)' }}>
              Live technology news fetching from Indian Express
            </p>

          </div>

        </header>

        {/* Live Updates */}
        <section className="glass-panel">

          <h2
            style={{
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >

            <span
              style={{
                width: '8px',
                height: '8px',
                background: 'var(--accent-purple)',
                borderRadius: '50%',
                display: 'inline-block'
              }}
            ></span>

            Live Updates

          </h2>

          <NewsFeed
            articles={articles}
            loading={newsLoading}
          />

        </section>

        {/* Charts */}
        <section className="glass-panel">

          <h2 style={{ marginBottom: '1.5rem' }}>
            Market Insights
          </h2>

          <DashboardCharts
            articles={articles}
            loading={newsLoading}
          />

        </section>

      </main>

      {/* Side Panel */}
      <aside className="side-panel">

        {/* Top Influences */}
        <section
          className="glass-panel"
          onClick={() =>
            window.open(
              "https://twitter.com/elonmusk",
              "_blank"
            )
          }
          style={{
            cursor: "pointer"
          }}
        >

          <h3
            style={{
              marginBottom: '1.5rem',
              color: 'var(--accent-cyan)'
            }}
          >
            Top Influences (Real-Time)
          </h3>

          <p
            style={{
              color: '#ccc',
              marginBottom: '1rem'
            }}
          >
            Click to explore tech influencers
          </p>

          <MarketSurvey />

        </section>

        {/* Discoveries */}
        <section
          className="glass-panel"
          onClick={() =>
            window.open(
              "https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqYUdJU0FtVnVLQUFQAQ",
              "_blank"
            )
          }
          style={{
            cursor: "pointer"
          }}
        >

          <h3
            style={{
              marginBottom: '1.5rem',
              color: 'var(--accent-purple)'
            }}
          >
            Major Discoveries
          </h3>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              marginBottom: '1.5rem'
            }}
          >
            Within one month span
          </p>

          <DiscoveriesTimeline />

        </section>

      </aside>

    </div>
  );
}

export default App;