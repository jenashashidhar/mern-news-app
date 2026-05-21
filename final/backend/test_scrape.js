const axios = require('axios');
const cheerio = require('cheerio');

async function testFetch() {
    try {
        const { data } = await axios.get('https://indianexpress.com/section/technology/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);
        const articles = [];
        // Typically Indian Express lists articles in divs with class 'articles' or inside a specific main container
        // Let's grab the top stories
        $('h2, h3').each((i, el) => {
            const title = $(el).text().trim();
            let link = $(el).find('a').attr('href') || $(el).closest('a').attr('href');
            
            // Indian express usually puts the summary in a sibling <p> or nearby
            const parent = $(el).parent();
            const summary = parent.find('p').text().trim() || parent.next('p').text().trim();
            const image = parent.find('img').attr('src') || parent.parent().find('img').attr('src');
            
            if (title && link && title.length > 15) {
                articles.push({ title, link, summary, image, source: { name: 'Indian Express' }, publishedAt: new Date().toISOString() });
            }
        });
        
        console.log(JSON.stringify(articles.slice(0, 5), null, 2));
    } catch(err) {
        console.error(err.message);
    }
}
testFetch();
