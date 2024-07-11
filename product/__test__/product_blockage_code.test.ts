import request from "supertest";
import { app } from "../app/index.app";
import { makeRandomString } from "@zencorp/engrenages";

// Helper functions ---

const createBlockageCode = async () => {
  return request(app)
    .post("/api/product/blockage")
    .send({
      "name": makeRandomString(3),
      "description": makeRandomString(50)
    });
};

// TESTS --------------

("fetches all the existing product blockage code");

// --------------------

test.todo("creates a product blockage type when given valid inputs");

// --------------------

test.todo("returns an error when trying to create a product blockage type with invalid inputs");

// --------------------

test.todo("creates and updates a product blockage code when given valid inputs");

// --------------------

test.todo("returns an error when trying to update a product blockage code with invalid inputs");

// --------------------

test.todo("creates and deletes a product when given valid input");

// --------------------

test.todo("returns an error when trying to delete a product blockage code with invalid input");

// --------------------

test.todo("fetches a single product blockage code when given valid input");

// --------------------

test.todo("creates and updates a product blockage type several type and checks the version");

// --------------------

