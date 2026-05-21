const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

const GNEWS_API_KEY = process.env.NEWS_API_KEY || '7d1e1f22a8b3e153f82f02baf556577d';

// Mock Data for Discoveries
const discoveries = [
    { id: 1, title: 'Breakthrough in Quantum Error Correction', date: '2026-05-15', summary: 'Researchers have demonstrated a new topological error correction model that boosts coherence times by 200%.' },
    { id: 2, title: 'First Solid-State EV Batteries Hit Mass Production', date: '2026-05-10', summary: 'Major automaker begins scaling up solid-state battery lines, promising 600-mile ranges.' },
    { id: 3, title: 'AI Model Achieves General Reasoning Benchmark', date: '2026-04-28', summary: 'A new multi-modal AI has surpassed human baselines on the challenging ARCagi benchmark.' },
    { id: 4, title: 'Commercial Fusion Reactor Design Approved', date: '2026-04-22', summary: 'Regulatory bodies have greenlit the first commercial net-positive fusion reactor design in Europe.' }
];

// Mock Data for Market Influences Survey
let surveys = [
    { id: 1, name: 'AI & Machine Learning', votes: 450 },
    { id: 2, name: 'Quantum Computing', votes: 120 },
    { id: 3, name: 'Green Tech & Solid State', votes: 310 },
    { id: 4, name: 'Space Exploration Tech', votes: 150 },
    { id: 5, name: 'Cybersecurity', votes: 200 }
];

let cachedArticles = [];
let lastFetchTime = 0;

router.get('/news', async (req, res) => {
    try {
        const now = Date.now();
        if (cachedArticles.length > 0 && (now - lastFetchTime) < 60000) {
            return res.json({ source: 'Indian Express (Cached)', articles: cachedArticles });
        }

        const { data } = await axios.get('https://indianexpress.com/section/technology/', {
            timeout: 8000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Cache-Control': 'no-cache'
            }
        });
        const $ = cheerio.load(data);
        const articles = [];
        
        $('h2, h3').each((i, el) => {
            let title = $(el).text().trim();
            title = title.replace(/^[\w\s]+\n\t+/, '').trim();
            
            let link = $(el).find('a').attr('href') || $(el).closest('a').attr('href');
            const parent = $(el).parent();
            const summary = parent.find('p').text().trim() || parent.next('p').text().trim();
            const image = $(el).find('img').attr('src') || parent.find('img').attr('src') || parent.parent().find('img').attr('src');
            
            if (title && link && title.length > 15 && !title.includes('Technology')) {
                articles.push({ 
                    title, link, description: summary || "Read more on Indian Express", image, content: summary, 
                    source: { name: 'Indian Express' }, publishedAt: new Date().toISOString() 
                });
            }
        });
        
        const finalArticles = articles.slice(0, 10);
        if (finalArticles.length > 0) {
            cachedArticles = finalArticles;
            lastFetchTime = now;
        }

        res.json({ source: 'Indian Express', articles: finalArticles });
    } catch (error) {
        console.error('Error fetching news:', error.message);
        // Fallback to cached if available
        if (cachedArticles.length > 0) {
            return res.json({ source: 'Indian Express (Fallback Cache)', articles: cachedArticles });
        }
        
        // Fallback Mock Data if completely blocked
        const fallback = [
            { title: "Apple rolls out sleep apnea notifications for Indian users", link: "#", description: "The feature uses accelerometer data.", source: { name: "Indian Express" }, publishedAt: new Date().toISOString() },
            { title: "OpenAI claims model solved 80-year-old math problem", link: "#", description: "AI breakthrough claimed by OpenAI.", source: { name: "Indian Express" }, publishedAt: new Date().toISOString() },
            { title: "‘AI moves fast, government doesn’t’: Dell CTO John Roese", link: "#", description: "Dell CTO discusses AI regulations.", source: { name: "Indian Express" }, publishedAt: new Date().toISOString() }
        ];
        res.json({ source: 'Indian Express (Fallback)', articles: fallback });
    }
});

router.get('/discoveries', (req, res) => {
    res.json({ discoveries });
});

router.get('/surveys', (req, res) => {
    res.json({ surveys });
});

router.post('/surveys/vote', (req, res) => {
    const { id } = req.body;
    const item = surveys.find(s => s.id === id);
    if (item) {
        item.votes += 1;
        res.json({ success: true, item });
    } else {
        res.status(404).json({ error: 'Survey item not found' });
    }
});

module.exports = router;
