const express = require("express");

const {
  cache,
  clearCache,
  getCacheStats
} = require("../src");

const app = express();

app.use(express.json());

let products = [
  { id: 1, name: "Keyboard", price: 1000 },
  { id: 2, name: "Mouse", price: 500 },
  { id: 3, name: "Monitor", price: 10000 }
];

// Cache GET /products for 30 seconds
app.get("/products", cache(30), (req, res) => {
  console.log("Fetching products from database...");

  res.json(products);
});

// Cache GET /products/:id
app.get("/products/:id", cache(30), (req, res) => {
  const product = products.find(
    p => p.id === Number(req.params.id)
  );

  if (!product) {
    return res.status(404).json({
      message: "Product not found"
    });
  }

  res.json(product);
});

// Create a product
app.post("/products", (req, res) => {
  const newProduct = {
    id: products.length + 1,
    ...req.body
  };

  products.push(newProduct);

  // Clear product-related cache
  clearCache();

  res.status(201).json(newProduct);
});

// Cache statistics
app.get("/cache/stats", (req, res) => {
  res.json(getCacheStats());
});

// Clear cache manually
app.delete("/cache", (req, res) => {
  clearCache();

  res.json({
    message: "Cache cleared"
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});