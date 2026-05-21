const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/api/news", async (req, res) => {

  try {

    const response = await axios.get(
      "https://newsapi.org/v2/top-headlines",
      {
        params: {
          country: "us",
          category: "technology",
          pageSize: 12,

          // PUT YOUR NEWS API KEY HERE
          apiKey: "YOUR_NEWS_API_KEY",
        },
      }
    );

    const articles = response.data.articles.map((article) => {

      // Better AI-style summary generation

      let aiSummary = "";

      if (article.description && article.content) {

        aiSummary =
          `${article.description}

This technology update highlights important developments in the tech industry. ${article.content.replace(/\[\+\d+ chars\]/, "")}`;

      }

      else if (article.description) {

        aiSummary =
          `${article.description}

Experts believe this news could influence future technology trends and innovation worldwide.`;

      }

      else if (article.content) {

        aiSummary =
          article.content.replace(/\[\+\d+ chars\]/, "");

      }

      else {

        aiSummary =
          `This article discusses recent breakthroughs and updates in the technology sector involving ${article.title}.`;

      }

      return {

        title: article.title,

        description: article.description,

        content: article.content,

        url: article.url,

        urlToImage: article.urlToImage,

        publishedAt: article.publishedAt,

        source: {
          name: article.source?.name || "Tech News",
        },

        aiSummary,
      };
    });

    res.json({ articles });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error fetching tech news",
    });

  }

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});