import request from "supertest";
import { app } from "../app/index.app";
import { makeRandomString } from "@zencorp/engrenages";

// Helper functions ---

export const createRole = async () => {
  return request(app)
    .post("/api/user/role")
    .send({
      "name": makeRandomString(5)
    });
};

// TESTS --------------

it("fetches all existing roles", async () => {
  await createRole();
  await createRole();
  await createRole();

const response = await request(app)
  .get("/api/user/role")
  .send()
  .expect(200);

  expect(response.body.length).toEqual(3);
});

// --------------------

it("fetches a single existing role when given valid ID", async () => {
  const user = await createRole();

  const response = await request(app)
    .get(`/api/user/role/${user.body.id}`)
    .send()
    .expect(200);
  
  expect(response.body.id).toEqual(user.body.id);
});

// --------------------

it("creates a role when given valid inputs", async () => {
  await request(app)
    .post("/api/user/role")
    .send({
      "name": "operator"
    })
    .expect(201);
});

// --------------------

it("returns a 400 error when trying to create a role with invalid input", async () => {
  await request(app)
    .post("/api/user/role")
    .send({
      "name": makeRandomString(11) // <-- sending a 11 characters long instead of 10 max
    })
    .expect(400);
});

// --------------------

it("returns a 400 error when trying to create a role with missing name", async () => {
  await request(app)
    .post("/api/user/role")
    .send({
      // sending an empty body
    })
    .expect(400);
});

// --------------------

it("returns a 400 when trying to create an already existing role", async () => {
  const role = await createRole();

  await request(app)
    .post("/api/user/role")
    .send({
      "name": `${role.body.name}`
    })
    .expect(400);

});

// --------------------

it("creates and updates a role when given valid inputs", async () => {
  const role = await createRole();

  const response = await request(app)
    .patch(`/api/user/role/${role.body.id}`)
    .send({
      "name": "key-user"
    })
    .expect(200);

  expect(response.body.name).toEqual("key-user");
});

// --------------------

it("returns a 400 error when trying to update a role with invalid input", async () => {
  const role = await createRole();

  await request(app)
    .patch(`/api/user/role/${role.body.id}`)
    .send({
      "name": makeRandomString(11) // <-- sending a 11 characters long name instead of 10 max
    })
    .expect(400);
});

// --------------------

it("creates and deletes a role when given valid ID", async () => {
  const role = await createRole();

  await request(app)
    .delete(`/api/user/role/${role.body.id}`)
    .send()
    .expect(200);

  await request(app)
    .get(`/api/user/role/${role.body.id}`)
    .send()
    .expect(404);
});

// --------------------

it("creates and updates a role several times and checks the version", async () => {
  const role = await createRole();

  const responseOne = await request(app)
    .patch(`/api/user/role/${role.body.id}`)
    .send({
      "name": "caporal"
    })
    .expect(200);

  const responseTwo = await request(app)
    .patch(`/api/user/role/${role.body.id}`)
    .send({
      "name": "sergent"
    })
    .expect(200);

  const responseThree = await request(app)
    .patch(`/api/user/role/${role.body.id}`)
    .send({
      "name": "commandant"
    })
    .expect(200);

  expect(responseOne.body.name).toEqual("caporal");
  expect(responseOne.body.version).toEqual(1);
  expect(responseTwo.body.name).toEqual("sergent");
  expect(responseTwo.body.version).toEqual(2);
  expect(responseThree.body.name).toEqual("commandant");
  expect(responseThree.body.version).toEqual(3);
});

// --------------------

it("returns appropriate error when given invalid IDs", async () => {
  const inexistingID = "999";
  const invalidID = "notAnID";

  await request(app)
    .get(`/api/user/role/${inexistingID}`)
    .send()
    .expect(404);

  await request(app)
    .get(`/api/user/role/${invalidID}`)
    .send()
    .expect(400);

  await request(app)
    .patch(`/api/user/role/${inexistingID}`) 
    .send({
      "name": makeRandomString(3) 
    })
    .expect(404);

  await request(app)
    .patch(`/api/user/role/${invalidID}`)
    .send({
      "name": makeRandomString(3) 
    })
    .expect(400);

  await request(app)
    .delete(`/api/user/role/${inexistingID}`) 
    .send()
    .expect(404);

  await request(app)
    .delete(`/api/user/role/${invalidID}`)
    .send()
    .expect(400);
});

// --------------------

it("creates a role and creates a user with the created role", async () => {
  const role = await createRole();

  const user = await request(app)
    .post("/api/user")
    .send({
      "first_name": makeRandomString(5),
      "last_name": makeRandomString(10),
      "email": "test@gmail.com",
      "password": makeRandomString(18),
      "role_name": `${role.body.name}`
    })
    .expect(201);

  const response = await request(app)
    .get(`/api/user/${user.body.id}`)
    .send()
    .expect(200);

  expect(response.body.role_name).toEqual(role.body.name);
});

// --------------------

it("returns an error when trying to delete a role affected to a user", async () => {
  const role = await createRole();

  await request(app)
    .post("/api/user")
    .send({
      "first_name": makeRandomString(5),
      "last_name": makeRandomString(10),
      "email": `${makeRandomString(5)}.${makeRandomString(7)}@${makeRandomString(4)}.com`,
      "password": makeRandomString(18),
      "role_name": `${role.body.name}`
    })
    .expect(201);
  
  await request(app)
    .delete(`/api/user/role/${role.body.id}`)
    .send()
    .expect(400);
});

// --------------------

test.todo("returns an error when trying to create a role with no authorization");

// --------------------

test.todo("returns an error when trying to update a role with no authorization");

// --------------------

test.todo("returns an error when trying to delete a role with no authorization");

// --------------------