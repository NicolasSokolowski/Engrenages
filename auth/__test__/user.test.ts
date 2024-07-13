import request from "supertest";
import { app } from "../app/index.app";
import { makeRandomString } from "@zencorp/engrenages";
import { createRole } from "./role.test";

// Helper functions ---

export const createUser = async () => {
  const roleName = await createRole();

  await request(app)
    .post("/api/auth/signup")
    .send({
      "first_name": makeRandomString(5),
      "last_name": makeRandomString(10),
      "email": `${makeRandomString(5)}.${makeRandomString(7)}@${makeRandomString(4)}.com`,
      "password": makeRandomString(18),
      "role_name": `${roleName.body.name}`
    });
};

// TESTS --------------

test.todo("fetches all the existing users");

// --------------------

test.todo("fetches a single user when given valid ID");

// --------------------

test.todo("creates a user when given valid inputs");

// --------------------

test.todo("returns a 400 error when trying to create a user with invalid inputs");

// --------------------

test.todo("returns a 400 error when trying to create a user with already existing email");

// --------------------

test.todo("creates and updates a user when given valid inputs");

// --------------------

test.todo("returns a 400 error when trying to update a user with invalid inputs");

// --------------------

test.todo("creates and deletes a user when given valid ID");

// --------------------

test.todo("creates and updates a user several times and checks the version");

// --------------------

test.todo("returns appropriate error when given invalid IDs");

// --------------------

test.todo("returns an error when trying to create a user with no authorization");

// --------------------

test.todo("returns an error when trying to update a user with no authorization");

// --------------------

test.todo("returns an error when trying to delete a user with no authorization");

// --------------------

