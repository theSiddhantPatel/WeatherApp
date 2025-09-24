const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "src")));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/weather", async (req, res) => {
  try {
    const city = req.query.q || "Delhi";
    const apiKey = process.env.key;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&units=metric&appid=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Weather fetch failed" });
  }
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "src", "index.html"));
});

const port = process.env.PORT || 5678;

app.listen(port, () => {
  console.log("server running on port: ", port);
});
