import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function DiscoveriesTimeline() {
  const [discoveries, setDiscoveries] = useState([]);

  useEffect(() => {
    const fetchDiscoveries = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/discoveries');
        setDiscoveries(res.data.discoveries);
      } catch (error) {
        console.error("Error fetching discoveries:", error);
      }
    };
    fetchDiscoveries();
  }, []);

  return (
    <div className="timeline">
      {discoveries.map((discovery, index) => (
        <div key={index} className="timeline-item">
          <div className="timeline-date">{new Date(discovery.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
          <div className="timeline-title">{discovery.title}</div>
          <div className="timeline-desc">{discovery.summary}</div>
        </div>
      ))}
    </div>
  );
}
