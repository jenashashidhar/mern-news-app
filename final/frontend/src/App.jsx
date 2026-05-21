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
        const res = await axios.get('http://localhost:5000/api/news');
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
      {/* Main Content Area: News and Charts */}
      <main className="main-content">
        <header className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Activity size={32} color="var(--accent-cyan)" />
          <div>
            <div className="header-subtitle">Real-Time Data</div>
            <h1 className="header-title">Tech Radar</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Live technology news fetching from Indian Express</p>
          </div>
        </header>

        <section className="glass-panel">
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', background: 'var(--accent-purple)', borderRadius: '50%', display: 'inline-block' }}></span>
            Live Updates
          </h2>
          <NewsFeed articles={articles} loading={newsLoading} />
        </section>

        <section className="glass-panel">
          <h2 style={{ marginBottom: '1.5rem' }}>Market Insights</h2>
          <DashboardCharts articles={articles} loading={newsLoading} />
        </section>
      </main>

      {/* Side Panel Area: Survey and Discoveries */}
      <aside className="side-panel">
        <section className="glass-panel">
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-cyan)' }}>Top Influences (Real-Time)</h3>
          <MarketSurvey />
        </section>

        <section className="glass-panel">
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-purple)' }}>Major Discoveries</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Within one month span</p>
          <DiscoveriesTimeline />
        </section>
      </aside>
    </div>
  );
}

export default App;
