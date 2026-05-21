import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ThumbsUp } from 'lucide-react';

export default function MarketSurvey() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/surveys');
        setSurveys(res.data.surveys);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching surveys:", error);
        setLoading(false);
      }
    };
    fetchSurveys();
  }, []);

  const handleVote = async (id) => {
    try {
      const res = await axios.post('http://localhost:5000/api/surveys/vote', { id });
      if (res.data.success) {
        setSurveys(surveys.map(s => s.id === id ? res.data.item : s));
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  if (loading) return null;

  const totalVotes = surveys.reduce((acc, curr) => acc + curr.votes, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {surveys.sort((a,b) => b.votes - a.votes).map(survey => {
        const percentage = totalVotes === 0 ? 0 : Math.round((survey.votes / totalVotes) * 100);
        return (
          <div key={survey.id} className="list-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{survey.name}</span>
              <button 
                onClick={() => handleVote(survey.id)}
                className="btn" 
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', borderColor: 'transparent' }}
              >
                <ThumbsUp size={14} /> {survey.votes}
              </button>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px', textAlign: 'right' }}>
              {percentage}%
            </div>
          </div>
        );
      })}
    </div>
  );
}
