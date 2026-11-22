# express-cache-kit

Lightweight in-memory caching middleware for Express.

## Installation

\`\`\`bash
npm install express-cache-kit
\`\`\`

## Basic usage

\`\`\`js
const express = require("express");
const { cache } = require("express-cache-kit");

const app = express();

app.get("/products", cache(60), (req, res) => {
  res.json([
    { id: 1, name: "Keyboard" },
    { id: 2, name: "Mouse" }
  ]);
});
\`\`\`

## Configuration

\`\`\`js
cache({
  ttl: 60,
  methods: ["GET"],
  maxSize: 1000
});
\`\`\`

## Cache statistics

\`\`\`js
const { getCacheStats } = require("express-cache-kit");

console.log(getCacheStats());
\`\`\`

## Clear cache

\`\`\`js
const { clearCache } = require("express-cache-kit");

clearCache();
\`\`\`

## License

MIT