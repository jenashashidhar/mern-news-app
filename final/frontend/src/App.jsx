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

      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* HEADER */}
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

        {/* LIVE NEWS */}
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

        {/* CHARTS */}
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

      {/* SIDE PANEL */}
      <aside className="side-panel">

        {/* TOP INFLUENCES */}
        <section className="glass-panel">

          <h3
            style={{
              marginBottom: '1rem',
              color: 'var(--accent-cyan)'
            }}
          >
            Top Influences (Real-Time)
          </h3>

          <p style={{ color: '#ccc' }}>
            Click below to explore
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginTop: '15px'
            }}
          >

            <button
              onClick={() =>
                window.open(
                  'https://twitter.com/elonmusk',
                  '_blank'
                )
              }
              className="influence-btn"
            >
              Elon Musk
            </button>

            <button
              onClick={() =>
                window.open(
                  'https://twitter.com/sama',
                  '_blank'
                )
              }
              className="influence-btn"
            >
              Sam Altman
            </button>

            <button
              onClick={() =>
                window.open(
                  'https://twitter.com/sundarpichai',
                  '_blank'
                )
              }
              className="influence-btn"
            >
              Sundar Pichai
            </button>

          </div>

          <MarketSurvey />

        </section>

        {/* MAJOR DISCOVERIES */}
        <section className="glass-panel">

          <h3
            style={{
              marginBottom: '1rem',
              color: 'var(--accent-purple)'
            }}
          >
            Major Discoveries
          </h3>

          <p
            style={{
              color: 'var(--text-secondary)',
              marginBottom: '1rem'
            }}
          >
            Within one month span
          </p>

          <button
            onClick={() =>
              window.open(
                'https://news.google.com/',
                '_blank'
              )
            }
            style={{
              background: '#ff4fd8',
              color: 'white',
              border: 'none',
              padding: '10px 15px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Open Discoveries
          </button>

          <div style={{ marginTop: '1rem' }}>
            <DiscoveriesTimeline />
          </div>

        </section>

      </aside>

    </div>

  );
}

export default App;