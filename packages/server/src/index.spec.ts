import { describe, it, expect } from "vitest";

import request from "supertest";
import express from "express";

const app = express();

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the API!" });
});

describe("API Endpoints", () => {
  it("should return hello message", async () => {
    const res = await request(app).get("/api/hello");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Hello from the API!");
  });
});
