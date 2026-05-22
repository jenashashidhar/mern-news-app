import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

app.get("/api/news", async (req, res) => {
  try {
    const response = await axios.get("https://newsapi.org/v2/top-headlines", {
      params: {
        category: "technology",
        language: "en",
        pageSize: 15,
        apiKey: process.env.NEWSAPI_KEY,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(error?.response?.status || 500).json({
      message:
        error?.response?.data?.message || "Failed to fetch news from NewsAPI.",
    });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));