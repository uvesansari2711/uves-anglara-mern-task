import request from "supertest";
import app from "../../src/app";
import { setupTestDB } from "./setupMongoMemoryServer";

setupTestDB();

describe("Auth Routes", () => {
  const userPayload = {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
  };

  test("POST /api/auth/register should create user and return token", async () => {
    const res = await request(app).post("/api/auth/register").send(userPayload);

    expect(res.status).toBe(201);
    expect(res.body.data.user).toBeDefined();
    expect(res.body.data.token).toBeDefined();
  });

  test("POST /api/auth/login should login and return token", async () => {
    await request(app).post("/api/auth/register").send(userPayload);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: userPayload.email, password: userPayload.password });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });
});
