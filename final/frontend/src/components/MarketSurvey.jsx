import React from 'react';

export default function MarketSurvey() {

  const influencers = [
    {
      name: "Elon Musk",
      link: "https://twitter.com/elonmusk"
    },
    {
      name: "Sam Altman",
      link: "https://twitter.com/sama"
    },
    {
      name: "Sundar Pichai",
      link: "https://twitter.com/sundarpichai"
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {influencers.map((person, index) => (
        <a
          key={index}
          href={person.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '12px',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.05)',
            color: '#00d4ff',
            textDecoration: 'none',
            fontWeight: 'bold',
            transition: '0.3s'
          }}
        >
          {person.name}
        </a>
      ))}
    </div>
  );
}