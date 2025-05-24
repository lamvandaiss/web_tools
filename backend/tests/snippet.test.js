// tests/snippet.test.js
const request = require("supertest");
const app = require("../src/app"); // file app.js của bạn
const mongoose = require("mongoose");
const Snippet = require("../models/snippet.model");

beforeAll(async () => {
  // Kết nối tới database test
  await mongoose.connect("mongodb://localhost:27017/tools_db_test");
  console.log("✅ Connected to test DB");
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe("Snippet API", () => {
  let snippetId = null;

  test("Tạo snippet mới", async () => {
    const res = await request(app)
      .post("/api/snippets")
      .send({
        title: "Test Snippet",
        language: "javascript",
        code: 'console.log("Hello")',
        tags: ["test", "js"],
      });

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body.title).toBe("Test Snippet");
    snippetId = res.body._id;
  });

  test("Lấy danh sách snippet", async () => {
    const res = await request(app).get("/api/snippets");
    expect([200, 201]).toContain(res.statusCode);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("Chỉnh sửa snippet", async () => {
    const update = {
      title: "Đã sửa tiêu đề",
      code: 'console.log("Đã sửa");',
    };

    const res = await request(app)
      .put(`/api/snippets/${snippetId}`)
      .send(update);

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body.title).toBe(update.title);
    expect(res.body.code).toBe(update.code);
  });

  test("Xóa snippet", async () => {
    const res = await request(app).delete(`/api/snippets/${snippetId}`);
    expect(res.statusCode).toBe(200);
  });
});
