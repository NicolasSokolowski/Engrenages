import "dotenv/config";
import request from "supertest";
import { app } from "../app/index.app";
import { BadRequestError, makeRandomString } from "@zencorp/engrenages";
import jwt from "jsonwebtoken";

// Helper functions ---

const expiredAccessToken = async () => {
  if(!process.env.ACCESS_TOKEN_SECRET) {
    throw new BadRequestError("Access token secret must be set");
  }
  const secret = process.env.ACCESS_TOKEN_SECRET;
  
  const response = await request(app)
  .post("/api/auth/signin")
  .send({
    "email": "admin@test.com",
    "password": "password"
  })
  .expect(200);

  const userPayload = {
    id: `${response.body.user.id}`,
    email: `${response.body.user.email}`,
    role: `${response.body.user.role}`,
    exp: Math.floor(Date.now() / 1000) - (60 * 60)
  };

  return jwt.sign(userPayload, secret);
}

const expiredRefreshToken = async () => {
  if(!process.env.REFRESH_TOKEN_SECRET) {
    throw new BadRequestError("Refresh token secret must be set");
  }
  const secret = process.env.REFRESH_TOKEN_SECRET;
  
  const response = await request(app)
  .post("/api/auth/signin")
  .send({
    "email": "admin@test.com",
    "password": "password"
  })
  .expect(200);

  const userPayload = {
    id: `${response.body.user.id}`,
    email: `${response.body.user.email}`,
    role: `${response.body.user.role}`,
    exp: Math.floor(Date.now() / 1000) - (60 * 60)
  };

  return jwt.sign(userPayload, secret);
}

// TESTS --------------

it("sign in a user when given valid inputs", async () => {
  const response = await request(app)
    .post("/api/auth/signin")
    .send({
      "email": "admin@test.com",
      "password": "password"
    })
    .expect(200);

  expect(response.body.user.first_name).toEqual("Admin");
});

// --------------------

it("returns an error when trying to sign in with missing email and/or password", async () => {
  await request(app)
    .post("/api/auth/signin")
    .send({
      "email": "admin@test.com",
    })
    .expect(400);

  await request(app)
    .post("/api/auth/signin")
    .send({
      "password": "password",
    })
    .expect(400);
});

// --------------------

it("trying to access a route with missing token(s)", async () => {
  const loggedUser = await request(app)
    .post("/api/auth/signin")
    .send({
      "email": "admin@test.com",
      "password": "password"
    })
    .expect(200);

  await request(app)
    .post("/api/user")
    .send()
    .expect(401);

  await request(app)
    .post("/api/user")
    .set("authorization", `Bearer ${loggedUser.body.tokens.accessToken}`)
    .send()
    .expect(401);

  await request(app)
    .post("/api/user")
    .set("x-refresh-token", `${loggedUser.body.tokens.refreshToken}`)
    .send()
    .expect(401);
});

// --------------------

it("Access a route with expired access token and valid refresh token", async () => {
  const loggedUser = await request(app)
    .post("/api/auth/signin")
    .send({
      "email": "admin@test.com",
      "password": "password"
    })
    .expect(200);

  const accessToken = await expiredAccessToken();

  await request(app)
    .post("/api/user/role")
    .set("authorization", `Bearer ${accessToken}`)
    .set("x-refresh-token", `${loggedUser.body.tokens.refreshToken}`)
    .send({
      "name": "key-user"
    })
    .expect(201);
});

// --------------------

it("Access a route with valid access token and expired refresh token", async () => {
  const loggedUser = await request(app)
    .post("/api/auth/signin")
    .send({
      "email": "admin@test.com",
      "password": "password"
    })
    .expect(200);

  const refreshToken = await expiredRefreshToken();

  await request(app)
    .post("/api/user/role")
    .set("authorization", `Bearer ${loggedUser.body.tokens.accessToken}`)
    .set("x-refresh-token", `${refreshToken}`)
    .send({
      "name": "key-user"
    })
    .expect(201);
});

// --------------------

it("returns a 401 error trying to access a route with expired access token and expired refresh token", async () => {
  const accessToken = await expiredAccessToken();
  const refreshToken = await expiredRefreshToken();

  await request(app)
    .post("/api/user/role")
    .set("authorization", `Bearer ${accessToken}`)
    .set("x-refresh-token", `${refreshToken}`)
    .send({
      "name": "key-user"
    })
    .expect(401);
});

// --------------------

it("returns a 403 error when trying to access a route with not enough permissions", async () => {
  const operatorUser = await request(app)
    .post("/api/auth/signin")
    .send({
      "email": "operator@test.com",
      "password": "password"
    })
    .expect(200);

  await request(app)
    .post("/api/user")
    .set("authorization", `Bearer ${operatorUser.body.tokens.accessToken}`)
    .set("x-refresh-token", `${operatorUser.body.tokens.refreshToken}`)
    .send({
      "first_name": makeRandomString(5),
      "last_name": makeRandomString(10),
      "email": `${makeRandomString(5)}.${makeRandomString(7)}@${makeRandomString(4)}.com`,
      "password": "password",
      "role_name": "operator"
    })
    .expect(403);

});