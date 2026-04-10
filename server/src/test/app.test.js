import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../app.js";

describe("app", () => {
  it("returns health status", async () => {
    const response = await request(app).get("/api/health").expect(200);

    expect(response.body).toEqual({
      status: "ok",
      service: "mango-grove-market-api",
    });
  });

  it("protects payment verification", async () => {
    const response = await request(app)
      .post("/api/payments/verify")
      .send({ method: "cod" })
      .expect(401);

    expect(response.body.message).toBe("Authentication required.");
  });
});
