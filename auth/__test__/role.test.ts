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

test.todo("fetches all existing roles");

// --------------------

test.todo("fetches a single existing role when given valid ID");

// --------------------

test.todo("creates a role when given valid inputs");

// --------------------

test.todo("returns a 400 error when trying to create a role with invalid input");

// --------------------

test.todo("returns a 400 when trying to create an already existing role");

// --------------------

test.todo("creates and updates a role when given valid inputs");

// --------------------

test.todo("returns a 400 error when trying to update a role with invalid input");

// --------------------

test.todo("creates and deleted a role when given valid ID");

// --------------------

test.todo("creates and updates a role several times and checks the version");

// --------------------

test.todo("returns appropriate error when given invalid IDs");

// --------------------

test.todo("creates a role and creates a user with the created role");

// --------------------

test.todo("returns an error when trying to delete a role affected to a user");

// --------------------

test.todo("returns an error when trying to create a role with no authorization");

// --------------------

test.todo("returns an error when trying to update a role with no authorization");

// --------------------

test.todo("returns an error when trying to delete a role with no authorization");

// --------------------