const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());

/**
 * Clean article text
 */
function cleanText(text = "") {
  return text
    .replace(/\[\+\d+\schars\]/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * AI-style summary generator
 */
function generateAISummary(article) {

  const title = cleanText(article.title);
  const description = cleanText(article.description);
  const content = cleanText(article.content);

  // Combine article text
  const fullText = `${description} ${content}`;

  // Split into sentences
  const sentences = fullText
    .split(/[.!?]/)
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 25);

  // Remove duplicate sentences
  const uniqueSentences = [...new Set(sentences)];

  // Pick best sentences
  let selected = [];

  // First prefer description
  if (description) {
    selected.push(description);
  }

  // Add useful content sentences
  for (let sentence of uniqueSentences) {

    // Avoid repeating description
    if (
      !selected.includes(sentence) &&
      sentence.length > 40
    ) {
      selected.push(sentence);
    }

    // Limit summary length
    if (selected.length >= 3) break;
  }

  // Smart fallback
  if (selected.length === 0) {
    selected.push(
      `This article discusses recent technology updates involving ${title}.`
    );
  }

  // Add AI-style ending
  const endings = [
    "This development could influence future technology trends.",
    "Experts are closely monitoring the impact of this update.",
    "The story highlights rapid innovation in the tech industry.",
    "This news reflects ongoing changes in digital technology."
  ];

  const randomEnding =
    endings[Math.floor(Math.random() * endings.length)];

  return `${selected.join(". ")}. ${randomEnding}`;
}

app.get("/api/news", async (req, res) => {

  try {

    const response = await axios.get(
      "https://newsapi.org/v2/top-headlines",
      {
        params: {
          country: "us",
          category: "technology",
          pageSize: 12,
          apiKey: process.env.NEWS_API_KEY,
        },
      }
    );

    // Transform articles
    const articles = response.data.articles.map((article) => ({

      title: article.title,

      description: article.description,

      content: article.content,

      url: article.url,

      urlToImage: article.urlToImage,

      publishedAt: article.publishedAt,

      source: {
        name: article.source?.name || "Tech News",
      },

      aiSummary: generateAISummary(article),
    }));

    res.json({ articles });

  }

  catch (error) {

    console.error("News Fetch Error:", error.message);

    res.status(500).json({
      message: "Error fetching tech news",
    });

  }

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});