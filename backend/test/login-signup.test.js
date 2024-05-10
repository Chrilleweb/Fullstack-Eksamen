const request = require("supertest");
const app = require("../app");
const bcrypt = require("bcrypt");
const util = require("util");
const pool = require("../config/dbConfig");
require("dotenv").config();

process.env.JWT_SECRET = "my_test_jwt_secret";
process.env.SESSION_SECRET = "my_test_session_secret";

// Promisify pool.query for use with async/await
const query = util.promisify(pool.query).bind(pool);

const adminUser = {
  username: "testAdmin",
  email: "examplee@gmail.com",
  password: "adminpassword",
  role: "admin",
};

const user = {
  username: "testuser",
  email: "example@mail.com",
  password: "testpassword",
  role: "user",
};

beforeEach(async () => {
  await query("DELETE FROM users WHERE username = ?", [user.username]);
  await query("DELETE FROM users WHERE username = ?", [adminUser.username]);
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const hashedAdminPassword = await bcrypt.hash(adminUser.password, 10);
  await query("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)", [user.username, user.email, hashedPassword, user.role]);
  await query("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)", [adminUser.username, adminUser.email, hashedAdminPassword, adminUser.role]);
});

afterAll(async () => {
  await query("DELETE FROM users WHERE username = ?", [user.username]);
  await query("DELETE FROM users WHERE username = ?", [adminUser.username]);
  await query("DELETE FROM users WHERE username = ?", ["testusersignup1"]);
  pool.end();
});

describe("Login and Signup logic", () => {

  // test successful signup
  test("should register a new user", async () => {
    await request(app).post("/api/signup")
      .send({
        username: "testusersignup1",
        email: "christian@munk-nissen.dk",
        password: "password",
      })
      .expect(201);
  });

  // test successful login
  test("should login a user", async () => {
    await request(app).post("/api/login")
      .send({
        username: "testuser",
        password: "testpassword",
      })
      .expect(200);
  });

  // test login with invalid password
  test("should not login a user with invalid password", async () => {
    await request(app).post("/api/login")
      .send({
        username: "testuser",
        password: "invalidpassword",
      })
      .expect(401);
  });

  // test should not sign up a new user with existing username
  test("should not sign up a new user with existing username", async () => {
    await request(app).post("/api/signup")
      .send({
        username: "testuser",
        email: "example@mail.com",
        password: "password",
      })
      .expect(400);
  });

  // test should not sign up a user with existing email
  test("should not sign up a user with existing email", async () => {
    await request(app).post("/api/signup")
      .send({
        username: "testuser2",
        email: "example@mail.com",
        password: "password",
      })
      .expect(400);
  });


  // test signup validation username should be 3 or more characters
  test("should not register a user with username less than 3 characters", async () => {
    await request(app).post("/api/signup")
      .send({
        username: "us",
        password: "password",
      })
      .expect(400);
  });

  // test signup validation username should be 15 or less characters
  test("should not register a user with username more than 15 characters", async () => {
    await request(app).post("/api/signup")
      .send({
        username: "thisusernameistoolong",
        password: "password",
      })
      .expect(400);
  });

  // test signup validation password should be 6 or more characters
  test("should not register a user with password less than 6 characters", async () => {
    await request(app).post("/api/signup")
      .send({
        username: "testusersignup",
        password: "pass",
      })
      .expect(400);
  });

  // test signup validation password should be 20 or less characters
  test("should not register a user with password more than 20 characters", async () => {
    await request(app).post("/api/signup")
      .send({
        username: "testusersignup",
        password: "thispasswordistoolong",
      })
      .expect(400);
  });

  // test signup validation password is required
  test("should not register a user without a password", async () => {
    await request(app).post("/api/signup")
      .send({
        username: "testusersignup",
        password: "",
      })
      .expect(400);
  });

  // test signup validation username is required
  test("should not register a user without a username", async () => {
    await request(app).post("/api/signup")
      .send({
        username: "",
        password: "password",
      })
      .expect(400);
  });

  // test signup validation username is already taken
  test("should not register a user with an existing username", async () => {
    await request(app).post("/api/signup")
      .send({
        username: "testuser",
        password: "password",
      })
      .expect(400);
  });

  // test signup validation username can only contain alphanumeric characters
  test("should not register a user with invalid characters in username", async () => {
    await request(app).post("/api/signup")
      .send({
        username: "user!@#€€",
        password: "password",
      })
      .expect(400);
  });
});

describe("Authentication Flow", () => {
  let cookie;

  test("Login and Logout Flow", async () => {
    // Step 1: Login to obtain a token
    const loginResponse = await request(app)
      .post("/api/login")
      .send({
        username: "testuser",
        password: "testpassword",
      })
      .expect(200);

    // Step 2: Capture the "Set-Cookie" header (token in cookie)
    cookie = loginResponse.headers["set-cookie"].join(";");

    // Verify login was successful and cookie is set
    expect(cookie).toContain("token");

    // Step 3: Perform logout
    const logoutResponse = await request(app)
      .get("/api/logout")
      .set("Cookie", cookie)
      .expect(200);

    // Step 4: Verify logout response
    expect(logoutResponse.body.message).toEqual("User logged out successfully");

    // Verify that the "Set-Cookie" header aims to clear the token cookie
    expect(logoutResponse.headers["set-cookie"]).toBeTruthy();
    const cookieAfterLogout = logoutResponse.headers["set-cookie"].join(";");
    expect(cookieAfterLogout).toContain("token=;");
  });

  // Test access to home page with valid authentication
  test("Access to home page with valid authentication", async () => {
    const response = await request(app)
      .get("/auth/home")
      .set("Cookie", cookie)
      .expect(200);

    expect(response.body).toBeDefined();
  });

  // Test access to home page without authentication
  test("Access to home page without authentication should be denied", async () => {
    await request(app)
      .get("/auth/home")
      .expect(401);
  });

  // test user role is user when logged in to home page
  test("User role should be user when logged in to home page", async () => {
    const response = await request(app)
      .get("/auth/home")
      .set("Cookie", cookie)
      .expect(200);

    expect(response.body.role).toEqual("user");
  });

  // test get email from logged in user
  test("should get email from logged in user", async () => {
    const response = await request(app)
      .get("/auth/home")
      .set("Cookie", cookie)
      .expect(200);

    expect(response.body.email).toEqual("example@mail.com");
  });
});

describe("Authentication Flow admin", () => {
  let cookie;

  test("Admin Flow", async () => {
    // Step 1: Login to obtain a token
    const loginResponse = await request(app)
      .post("/api/login")
      .send({
        username: adminUser.username,
        password: adminUser.password,
        role: adminUser.role,
      })
      .expect(200);

    // Step 2: Capture the "Set-Cookie" header (token in cookie)
    cookie = loginResponse.headers["set-cookie"].join(";");

    // Verify login was successful and cookie is set
    expect(cookie).toContain("token");

    // Step 3: Access the admin dashboard
    const response = await request(app)
      .get("/auth/admin")
      .set("Cookie", cookie)
      .expect(200);

    // Step 4: Verify the response
    expect(response.body.role).toEqual("admin");
  });

  // Test access to admin page without authentication
  test("Access to admin page without authentication should be denied", async () => {
    await request(app)
      .get("/auth/admin")
      .expect(401);
  });

  // Test access to admin page with invalid authentication
  test("Access to admin page with invalid authentication should be denied", async () => {
    await request(app)
      .get("/auth/admin")
      .set("Cookie", "token=invalidtoken")
      .expect(401);
  });

  // Test access to admin page with user role
  test("Access to admin page with user role should be denied", async () => {
    // Step 1: Login to obtain a token
    const loginResponse = await request(app)
      .post("/api/login")
      .send({
        username: "testuser",
        password: "testpassword",
      })
      .expect(200);

    // Step 2: Capture the "Set-Cookie" header (token in cookie)
    cookie = loginResponse.headers["set-cookie"].join(";");

    // Verify login was successful and cookie is set
    expect(cookie).toContain("token");

    // Step 3: Access the admin dashboard
    await request(app)
      .get("/auth/admin")
      .set("Cookie", cookie)
      .expect(403);
  });

  // test success admin login
  test("should login an admin", async () => {
    await request(app).post("/api/login")
      .send({
        username: adminUser.username,
        password: adminUser.password,
        role: adminUser.role,
      })
      .expect(200);
  });
});



