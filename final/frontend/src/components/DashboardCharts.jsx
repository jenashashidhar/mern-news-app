import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['var(--accent-purple)', 'var(--accent-cyan)', 'var(--accent-blue)', '#ff9800', '#4caf50'];

export default function DashboardCharts({ articles, loading }) {
  
  // Dynamically analyze the headlines for keywords (Graph Data Generation)
  const pieData = useMemo(() => {
    if (!articles || articles.length === 0) return [];
    
    const keywords = { 'AI/ML': 0, 'Mobile/Hardware': 0, 'Software/Apps': 0, 'Business/Tech': 0 };
    
    articles.forEach(a => {
      const title = a.title.toLowerCase();
      if (title.includes('ai') || title.includes('artificial intelligence') || title.includes('chatgpt') || title.includes('openai') || title.includes('machine learning')) {
        keywords['AI/ML'] += 1;
      } else if (title.includes('phone') || title.includes('apple') || title.includes('samsung') || title.includes('laptop') || title.includes('device') || title.includes('hardware')) {
        keywords['Mobile/Hardware'] += 1;
      } else if (title.includes('app') || title.includes('software') || title.includes('update') || title.includes('windows')) {
        keywords['Software/Apps'] += 1;
      } else {
        keywords['Business/Tech'] += 1;
      }
    });

    // filter out zeros
    return Object.entries(keywords)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0);
  }, [articles]);

  const lineData = useMemo(() => {
    if (!articles || articles.length === 0) return [];
    
    // Since Indian Express might give articles from the same day, we simulate a week trend 
    // where the apex correlates with the 'AI/ML' or 'Mobile/Hardware' count from today's analysis.
    const baseVolume = articles.length * 2;
    const aiBonus = pieData.find(p => p.name === 'AI/ML')?.value || 0;
    
    return [
      { name: 'Mon', trend: baseVolume - 5 },
      { name: 'Tue', trend: baseVolume + 2 },
      { name: 'Wed', trend: baseVolume - 3 },
      { name: 'Thu', trend: baseVolume + 7 },
      { name: 'Fri', trend: baseVolume + aiBonus*2 },
      { name: 'Sat', trend: baseVolume + 10 },
      { name: 'Sun', trend: baseVolume + 4 + aiBonus }
    ];
  }, [articles, pieData]);

  if (loading) return <div style={{ color: 'var(--text-secondary)' }}>Analyzing dataset...</div>;
  if (!articles || articles.length === 0) return null;

  return (
    <div className="charts-container">
      {/* Pie Chart */}
      <div className="chart-wrapper">
        <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>Live Top Topics</h4>
        <div style={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart */}
      <div className="chart-wrapper">
        <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>Projected Trajectory & Volume</h4>
        <div style={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--accent-cyan)' }}
              />
              <Line type="monotone" dataKey="trend" stroke="var(--accent-cyan)" strokeWidth={3} dot={{ fill: 'var(--accent-purple)', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
