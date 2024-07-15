import request from "supertest";
import { app } from "../app/index.app";
import { makeRandomString } from "@zencorp/engrenages";
import { createRole, loggedAdmin, loggedOperator } from "./role.test";

// Helper functions ---

export const createUser = async () => {
  const admin = await loggedAdmin();

  const roleName = await createRole();

  return request(app)
    .post("/api/user")
    .set("authorization", `${admin.body.tokens.accessToken}`)
    .set("x-refresh-token", `${admin.body.tokens.refreshToken}`)
    .send({
      "first_name": makeRandomString(5),
      "last_name": makeRandomString(10),
      "email": `${makeRandomString(5)}.${makeRandomString(7)}@${makeRandomString(4)}.com`,
      "password": "password",
      "role_name": `${roleName.body.name}`
    });
};

// TESTS --------------

it("fetches a single user when given valid ID", async () => {
  const admin = await loggedAdmin();

  const user = await createUser();

  const response = await request(app)
    .get(`/api/user/${user.body.user.id}`)
    .set("authorization", `${admin.body.tokens.accessToken}`)
    .set("x-refresh-token", `${admin.body.tokens.refreshToken}`)
    .send()
    .expect(200);

  expect(response.body.first_name).toEqual(user.body.user.first_name);
});

// --------------------


it("creates a user when given valid inputs", async () => {
  const admin = await loggedAdmin();

  const roleName = await createRole();

  const user = await request(app)
    .post("/api/user")
    .set("authorization", `${admin.body.tokens.accessToken}`)
    .set("x-refresh-token", `${admin.body.tokens.refreshToken}`)
    .send({
      "first_name": "Mickey",
      "last_name": "Mouse",
      "email": `${makeRandomString(5)}.${makeRandomString(7)}@${makeRandomString(4)}.com`,
      "password": makeRandomString(18),
      "role_name": `${roleName.body.name}`
    })
    .expect(201);

  const response = await request(app)
    .get(`/api/user/${user.body.user.id}`)
    .set("authorization", `${admin.body.tokens.accessToken}`)
    .set("x-refresh-token", `${admin.body.tokens.refreshToken}`)
    .send()
    .expect(200);

  expect(response.body.role_name).toEqual(roleName.body.name);
});

// --------------------

it("returns a 400 error when trying to create a user with invalid input", async () => {
  const admin = await loggedAdmin();

  const role = await createRole();

  await request(app)
    .post("/api/user")
    .set("authorization", `${admin.body.tokens.accessToken}`)
    .set("x-refresh-token", `${admin.body.tokens.refreshToken}`)
    .send({
      "first_name": makeRandomString(30), // <-- sending a 30 characters long first name instead of 20 max
      "last_name": "Duck",
      "email": `${makeRandomString(5)}.${makeRandomString(7)}@${makeRandomString(4)}.com`,
      "password": makeRandomString(18),
      "role_name": `${role.body.name}`
    })
    .expect(400);
});

// --------------------

it("returns a 400 error when trying to create a user with already existing email", async () => {
  const admin = await loggedAdmin();
  const user = await createUser();

  await request(app)
    .post("/api/user")
    .set("authorization", `${admin.body.tokens.accessToken}`)
    .set("x-refresh-token", `${admin.body.tokens.refreshToken}`)
    .send({
      "first_name": "Minnie",
      "last_name": "Mouse",
      "email": `${user.body.email}`,
      "password": makeRandomString(18),
      "role_name": `${user.body.role_name}`
    })
    .expect(400);
});

// --------------------

it("creates and updates a user (not the password) when given valid inputs", async () => {
  const admin = await loggedAdmin();
  const user = await createUser();

  const response = await request(app)
    .patch(`/api/user/${user.body.user.id}`)
    .set("authorization", `${admin.body.tokens.accessToken}`)
    .set("x-refresh-token", `${admin.body.tokens.refreshToken}`)
    .send({
      "first_name": "Donald",
      "last_name": "Duck"
    })
    .expect(200);

  expect(response.body.first_name).toEqual("Donald");
  expect(response.body.last_name).toEqual("Duck");
});

// --------------------

it("returns a 400 error when trying to update a user (no password) with invalid inputs", async () => {
  const admin = await loggedAdmin();
  const user = await createUser();

  await request(app)
    .patch(`/api/user/${user.body.id}`)
    .set("authorization", `${admin.body.tokens.accessToken}`)
    .set("x-refresh-token", `${admin.body.tokens.refreshToken}`)
    .send({
      "first_name": "Donald",
      "last_name": makeRandomString(60) // <-- sending a 60 characters long lastname instead of 50 max
    })
    .expect(400);
});

// --------------------

it("creates and deletes a user when given valid ID", async () => {
  const admin = await loggedAdmin();
  const user = await createUser();

  await request(app)
    .delete(`/api/user/${user.body.user.id}`)
    .set("authorization", `${admin.body.tokens.accessToken}`)
    .set("x-refresh-token", `${admin.body.tokens.refreshToken}`)
    .send()
    .expect(200);

  await request(app)
    .get(`/api/user/${user.body.user.id}`)
    .set("authorization", `${admin.body.tokens.accessToken}`)
    .set("x-refresh-token", `${admin.body.tokens.refreshToken}`)
    .send()
    .expect(404);
});

// --------------------

it("creates and updates a user several times and checks the version", async () => {
  const admin = await loggedAdmin();
  const user = await createUser();

  const responseOne = await request(app)
    .patch(`/api/user/${user.body.user.id}`)
    .set("authorization", `${admin.body.tokens.accessToken}`)
    .set("x-refresh-token", `${admin.body.tokens.refreshToken}`)
    .send({
      "first_name": "Jimmy"
    })
    .expect(200);

  const responseTwo = await request(app)
    .patch(`/api/user/${user.body.user.id}`)
    .set("authorization", `${admin.body.tokens.accessToken}`)
    .set("x-refresh-token", `${admin.body.tokens.refreshToken}`)
    .send({
      "last_name": "Neutron"
    })
    .expect(200);

  const responseThree = await request(app)
    .patch(`/api/user/${user.body.user.id}`)
    .set("authorization", `${admin.body.tokens.accessToken}`)
    .set("x-refresh-token", `${admin.body.tokens.refreshToken}`)
    .send({
      "email": "Jimmy.neutron@retroville.com"
    })
    .expect(200);

  expect(responseOne.body.first_name).toEqual("Jimmy");
  expect(responseOne.body.version).toEqual(1);
  expect(responseTwo.body.last_name).toEqual("Neutron");
  expect(responseTwo.body.version).toEqual(2);
  expect(responseThree.body.email).toEqual("Jimmy.neutron@retroville.com");
  expect(responseThree.body.version).toEqual(3);
});

// --------------------

it("returns appropriate error when given invalid IDs", async () => {
  const admin = await loggedAdmin();

  const inexistingID = "999";
  const invalidID = "notAnID";

  await request(app)
    .get(`/api/user/${inexistingID}`)
    .set("authorization", `${admin.body.tokens.accessToken}`)
    .set("x-refresh-token", `${admin.body.tokens.refreshToken}`)
    .send()
    .expect(404);

  await request(app)
    .get(`/api/user/${invalidID}`)
    .set("authorization", `${admin.body.tokens.accessToken}`)
    .set("x-refresh-token", `${admin.body.tokens.refreshToken}`)
    .send()
    .expect(400);

  await request(app)
    .patch(`/api/user/${inexistingID}`)
    .set("authorization", `${admin.body.tokens.accessToken}`)
    .set("x-refresh-token", `${admin.body.tokens.refreshToken}`)
    .send({
      "first_name": makeRandomString(3) 
    })
    .expect(404);

  await request(app)
    .patch(`/api/user/${invalidID}`)
    .set("authorization", `${admin.body.tokens.accessToken}`)
    .set("x-refresh-token", `${admin.body.tokens.refreshToken}`)
    .send({
      "first_name": makeRandomString(3) 
    })
    .expect(400);

  await request(app)
    .delete(`/api/user/${inexistingID}`)
    .set("authorization", `${admin.body.tokens.accessToken}`)
    .set("x-refresh-token", `${admin.body.tokens.refreshToken}`)
    .send()
    .expect(404);

  await request(app)
    .delete(`/api/user/${invalidID}`)
    .set("authorization", `${admin.body.tokens.accessToken}`)
    .set("x-refresh-token", `${admin.body.tokens.refreshToken}`)
    .send()
    .expect(400);
});

// --------------------

it("returns an error when trying to create a user with missing inputs", async () => {
  const admin = await loggedAdmin();

  await request(app)
    .post("/api/user")
    .set("authorization", `${admin.body.tokens.accessToken}`)
    .set("x-refresh-token", `${admin.body.tokens.refreshToken}`)
    .send({
      "first_name": makeRandomString(5),
      "last_name": makeRandomString(10),
      "email": `${makeRandomString(5)}.${makeRandomString(7)}@${makeRandomString(4)}.com`,
      "password": makeRandomString(18)
      // role_name is missing
    })
    .expect(400);
});

// --------------------

it("returns an error when trying to create a user with a non existing role", async () => {
  const admin = await loggedAdmin();

  await request(app)
    .post("/api/user")
    .set("authorization", `${admin.body.tokens.accessToken}`)
    .set("x-refresh-token", `${admin.body.tokens.refreshToken}`)
    .send({
      "first_name": makeRandomString(5),
      "last_name": makeRandomString(10),
      "email": `${makeRandomString(5)}.${makeRandomString(7)}@${makeRandomString(4)}.com`,
      "password": makeRandomString(18),
      "role_name": "Idontexist"
    })
    .expect(400);
});

// --------------------

it("returns an error when trying to create a user with no authorization", async () => {
  const operator = await loggedOperator();

  await request(app)
    .post("/api/user/role")
    .set("authorization", `${operator.body.tokens.accessToken}`)
    .set("x-refresh-token", `${operator.body.tokens.refreshToken}`)
    .send({
      "name": "seller"
    })
    .expect(403);
});

// --------------------

it("returns an error when trying to update a user with no authorization", async () => {
  const operator = await loggedOperator();
  const role = await createRole();

  await request(app)
    .patch(`/api/user/role/${role.body.id}`)
    .set("authorization", `${operator.body.tokens.accessToken}`)
    .set("x-refresh-token", `${operator.body.tokens.refreshToken}`)
    .send({
      "name": "Terminator"
    })
    .expect(403);

});

// --------------------

it("returns an error when trying to delete a user with no authorization", async () => {
  const operator = await loggedOperator();
  const role = await createRole();

  await request(app)
    .patch(`/api/user/role/${role.body.id}`)
    .set("authorization", `${operator.body.tokens.accessToken}`)
    .set("x-refresh-token", `${operator.body.tokens.refreshToken}`)
    .send({
      "name": "Terminator"
    })
    .expect(403);
});

// --------------------

it("fetches all the existing users", async () => {
  const admin = await loggedAdmin();

  await createUser();
  await createUser();
  await createUser();

  const response = await request(app)
    .get(`/api/user`)
    .set("authorization", `${admin.body.tokens.accessToken}`)
    .set("x-refresh-token", `${admin.body.tokens.refreshToken}`)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(5);
});

// --------------------
