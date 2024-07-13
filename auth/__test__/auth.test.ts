import request from "supertest";
import { app } from "../app/index.app";
import { createRole } from "./role.test";
import { makeRandomString } from "@zencorp/engrenages";

// TESTS --------------

it("sign in a user when given valid inputs", async () => {
  const roleName = await createRole();

  const user = await request(app)
    .post("/api/user")
    .send({
      "first_name": makeRandomString(5),
      "last_name": makeRandomString(10),
      "email": "testt@test.com",
      "password": "password",
      "role_name": `${roleName.body.name}`
    })
    .expect(201);   

  await request(app)
    .post("/api/auth/signin")
    .send({
      "email": "test@test.com",
      "password": "password"
    })
    .expect(200);

  const response = await request(app)
    .get("/api/auth/currentuser")
    .send()
    .expect(200);

  expect(response.body.first_name).toEqual((await user).body.first_name);
});

// --------------------

it("returns an error when trying to sign in with missing email and/or password", async () => {
  const roleName = await createRole();

  const user = await request(app)
    .post("/api/user")
    .send({
      "first_name": makeRandomString(5),
      "last_name": makeRandomString(10),
      "email": "testt@test.com",
      "password": "password",
      "role_name": `${roleName.body.name}`
    })
    .expect(201);   

  await request(app)
    .post("/api/auth/signin")
    .send({
      "email": `${user.body.email}`
      // missing password
    })
    .expect(400);

  await request(app)
    .post("/api/auth/signin")
    .send({
      "password": `${user.body.password}`
      // missing email
    })
    .expect(400);
});

// --------------------

it("sign out a user", async () => {
  await request(app)
    .post("/api/auth/signout")
    .send()
    .expect(200);

  await request(app)
    .get("/api/auth/currentuser")
    .send()
    .expect(404);
});

// --------------------