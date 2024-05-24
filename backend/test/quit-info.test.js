const request = require("supertest");
const app = require("../app"); // Ensure this points to your Express application
const bcrypt = require("bcrypt");
const util = require("util");
const pool = require("../config/dbConfig");
require("dotenv").config();

const query = util.promisify(pool.query).bind(pool);

// Test users
const user = {
  username: "testuserquit",
  email: "examplequit@mail.com",
  password: "testpassword",
  role: "user",
};

beforeAll(async () => {
  await query("DELETE FROM users WHERE username = ?", [user.username]);
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const result = await query("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)", [user.username, user.email, hashedPassword, user.role]);
  user.userId = result.insertId;

  // Setup quit info for testing
  const quitDate = new Date().toISOString().slice(0, 10); // Current date
  await query("INSERT INTO quit_info (user_id, quit_date, cigarettes_per_day) VALUES (?, ?, ?)", [user.userId, quitDate, 20]);
});

afterAll(async () => {
  await query("DELETE FROM quit_info WHERE user_id = ?", [user.userId]);
  await query("DELETE FROM users WHERE id = ?", [user.userId]);
  pool.end();
});

describe("Quit Info Endpoints", () => {
  let token; // This will store the JWT token for authenticated requests

  beforeAll(async () => {
    // Login to obtain a token
    const response = await request(app)
      .post("/api/login")
      .send({
        username: user.username,
        password: user.password,
      });
    expect(response.statusCode).toBe(200);
    token = response.body.token; // Extract the token from the response body
  });

  test("Retrieve quit information", async () => {
    const response = await request(app)
      .get(`/auth/quit-info/${user.userId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("quit_date");
    expect(response.body).toHaveProperty("cigarettes_per_day");
  });

  test("Add quit information", async () => {
    const newquitDate = new Date();
    newquitDate.setDate(newquitDate.getDate() - 1); // Yesterday
    const response = await request(app)
      .post("/auth/quit-info")
      .set("Authorization", `Bearer ${token}`)
      .send({
        userId: user.userId,
        quit_date: newquitDate.toISOString().slice(0, 10),
        cigarettes_per_day: 15,
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  test("Update quit information", async () => {
    const updatedquitDate = new Date();
    updatedquitDate.setDate(updatedquitDate.getDate() - 2); // Two days ago
    const response = await request(app)
      .put(`/auth/quit-info/${user.userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quit_date: updatedquitDate.toISOString().slice(0, 10),
        cigarettes_per_day: 10,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual("Quit info updated successfully");
  });
});


