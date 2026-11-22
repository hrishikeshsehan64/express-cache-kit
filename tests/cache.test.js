const express = require("express");
const request = require("supertest");

import { describe, it, expect, beforeEach } from "vitest";

const {
  cache,
  clearCache,
  resetCacheStats,
  getCacheStats
} = require("../src");

describe("express-cache-kit", () => {
  let app;
  let counter;

  beforeEach(() => {
    clearCache();
    resetCacheStats();

    counter = 0;
    app = express();

    app.get("/test", cache(60), (req, res) => {
      counter++;

      res.json({
        counter
      });
    });
  });

  it("should cache GET responses", async () => {
    const first = await request(app).get("/test");
    const second = await request(app).get("/test");

    expect(first.body.counter).toBe(1);
    expect(second.body.counter).toBe(1);

    expect(first.headers["x-cache"]).toBe("MISS");
    expect(second.headers["x-cache"]).toBe("HIT");
  });

  it("should track cache hits and misses", async () => {
    await request(app).get("/test");
    await request(app).get("/test");

    const stats = getCacheStats();

    expect(stats.hits).toBe(1);
    expect(stats.misses).toBe(1);
  });

  it("should clear the cache", async () => {
    await request(app).get("/test");

    clearCache();

    const response = await request(app).get("/test");

    expect(response.body.counter).toBe(2);
    expect(response.headers["x-cache"]).toBe("MISS");
  });
});