import request from "supertest";
import app from "../../src/app";
import { setupTestDB } from "./setupMongoMemoryServer";

setupTestDB();

const registerAndLogin = async () => {
  const user = {
    name: "Test User",
    email: "cat@example.com",
    password: "password123",
  };

  await request(app).post("/api/auth/register").send(user);
  const res = await request(app).post("/api/auth/login").send({
    email: user.email,
    password: user.password,
  });

  return res.body.data.token as string;
};

describe("Category Routes", () => {
  let token: string;

  beforeEach(async () => {
    token = await registerAndLogin();
  });

  test("should create category and return it", async () => {
    const res = await request(app)
      .post("/api/category")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Electronics" });

    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe("Electronics");
  });

  test("should return category tree", async () => {
    const parent = await request(app)
      .post("/api/category")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Electronics" });

    await request(app)
      .post("/api/category")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Mobiles", parentId: parent.body.data._id });

    const res = await request(app)
      .get("/api/category")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test("marking a category inactive should cascade to children", async () => {
    const parentRes = await request(app)
      .post("/api/category")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Parent" });

    const childRes = await request(app)
      .post("/api/category")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Child", parentId: parentRes.body.data._id });

    await request(app)
      .put(`/api/category/${parentRes.body.data._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "inactive" });

    const treeRes = await request(app)
      .get("/api/category")
      .set("Authorization", `Bearer ${token}`);

    const parentNode = treeRes.body.data.find(
      (n: any) => n._id === parentRes.body.data._id
    );
    const childNode = parentNode.children.find(
      (c: any) => c._id === childRes.body.data._id
    );

    expect(parentNode.status).toBe("inactive");
    expect(childNode.status).toBe("inactive");
  });

  test("deleting a category reassigns its children", async () => {
    const rootRes = await request(app)
      .post("/api/category")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Root" });

    const midRes = await request(app)
      .post("/api/category")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Mid", parentId: rootRes.body.data._id });

    const childRes = await request(app)
      .post("/api/category")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Leaf", parentId: midRes.body.data._id });

    await request(app)
      .delete(`/api/category/${midRes.body.data._id}`)
      .set("Authorization", `Bearer ${token}`);

    const treeRes = await request(app)
      .get("/api/category")
      .set("Authorization", `Bearer ${token}`);

    const rootNode = treeRes.body.data.find(
      (n: any) => n._id === rootRes.body.data._id
    );
    const leafNode = rootNode.children.find(
      (c: any) => c._id === childRes.body.data._id
    );

    expect(leafNode).toBeDefined();
  });
});
