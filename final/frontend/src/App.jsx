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

        // YOUR RENDER BACKEND URL
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

        {/* LIVE UPDATES */}
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
            Click below to explore tech influencers
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginTop: '15px'
            }}
          >

            {/* ELON */}
            <button
              onClick={() =>
                window.open(
                  'https://twitter.com/elonmusk',
                  '_blank'
                )
              }
              style={{
                background: '#00d4ff',
                border: 'none',
                padding: '10px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                color: 'black'
              }}
            >
              Elon Musk
            </button>

            {/* SAM */}
            <button
              onClick={() =>
                window.open(
                  'https://twitter.com/sama',
                  '_blank'
                )
              }
              style={{
                background: '#00d4ff',
                border: 'none',
                padding: '10px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                color: 'black'
              }}
            >
              Sam Altman
            </button>

            {/* SUNDAR */}
            <button
              onClick={() =>
                window.open(
                  'https://twitter.com/sundarpichai',
                  '_blank'
                )
              }
              style={{
                background: '#00d4ff',
                border: 'none',
                padding: '10px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                color: 'black'
              }}
            >
              Sundar Pichai
            </button>

          </div>

          <div style={{ marginTop: '1rem' }}>
            <MarketSurvey />
          </div>

        </section>

        {/* MAJOR TECH DISCOVERIES */}
        <section className="glass-panel">

          <h3
            style={{
              marginBottom: '1rem',
              color: 'var(--accent-purple)'
            }}
          >
            Major Tech Discoveries
          </h3>

          <p
            style={{
              color: 'var(--text-secondary)',
              marginBottom: '1rem'
            }}
          >
            Latest breakthroughs in AI and technology
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >

            {/* OPENAI */}
            <button
              onClick={() =>
                window.open(
                  'https://openai.com/news/',
                  '_blank'
                )
              }
              style={{
                background: '#7c3aed',
                color: 'white',
                border: 'none',
                padding: '10px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              OpenAI Discoveries
            </button>

            {/* GOOGLE */}
            <button
              onClick={() =>
                window.open(
                  'https://blog.google/technology/ai/',
                  '_blank'
                )
              }
              style={{
                background: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '10px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Google AI Updates
            </button>

            {/* TECHCRUNCH */}
            <button
              onClick={() =>
                window.open(
                  'https://techcrunch.com/category/artificial-intelligence/',
                  '_blank'
                )
              }
              style={{
                background: '#059669',
                color: 'white',
                border: 'none',
                padding: '10px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              AI & Startup News
            </button>

          </div>

          <div style={{ marginTop: '1rem' }}>
            <DiscoveriesTimeline />
          </div>

        </section>

      </aside>

    </div>

  );
}

export default App;