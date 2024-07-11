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

it("fetches all the existing product blockage code", async () => {
  await createBlockageCode();
  await createBlockageCode();
  await createBlockageCode();

  const response = await request(app)
    .get("/api/product/blockage")
    .send()
    .expect(200);

  expect(response.body.length).toEqual(3);
});

// --------------------

it("fetches a single product blockage type if given valid ID", async () => {
  const blockageCode = await createBlockageCode();

  const response = await request(app)
    .get(`/api/product/blockage/${blockageCode.body.id}`)
    .send()
    .expect(200);

  expect(response.body.name).toEqual(blockageCode.body.name);
});

// --------------------

it("creates a product blockage type when given valid inputs", async () => {
  const response = await request(app)
    .post("/api/product/blockage")
    .send({
      "name": "RIA",
      "description": "Blockage test description"
    })
    .expect(201);

  expect(response.body.name).toEqual("RIA");
  expect(response.body.description).toEqual("Blockage test description");
});

// --------------------

it("returns an error when trying to create a product blockage type with invalid inputs", async () => {
  await request(app)
    .post("/api/product/blockage")
    .send({
      "name": 6666, // <-- sending 4 characters ("name" is VARCHAR(3))
      "description": "Blockage test description"
    })
    .expect(400); 
});

// --------------------

it("creates and updates a product blockage code when given valid inputs", async () => {
  const blockageCode = await createBlockageCode();

  const response = await request(app)
    .patch(`/api/product/blockage/${blockageCode.body.id}`)
    .send({
      "name": "FIR"
    })
    .expect(200);

  expect(response.body.name).toEqual("FIR");
});

// --------------------

it("returns an error when trying to update a product blockage code with invalid inputs", async () => {
  const blockageCode = await createBlockageCode();

  await request(app)
    .patch(`/api/product/blockage/${blockageCode.body.id}`)
    .send({
      "description": makeRandomString(111) // <-- sending a 101 characters string instead of a max 100
    })
    .expect(400);
});

// --------------------

it("creates and deletes a product when given valid input", async () => {
  const blockageCode = await createBlockageCode();

  await request(app)
    .delete(`/api/product/blockage/${blockageCode.body.id}`)
    .send()
    .expect(200);

  await request(app)
    .get(`/api/product/blockage/${blockageCode.body.id}`)
    .send()
    .expect(404);
});

// --------------------

it("creates and updates a product blockage type several type and checks the version", async () => {
  const blockageCode = await createBlockageCode();

  const responseOne = await request(app)
    .patch(`/api/product/blockage/${blockageCode.body.id}`)
    .send({
      "name": "DMG"
    })
    .expect(200);

  const responseTwo = await request(app)
    .patch(`/api/product/blockage/${blockageCode.body.id}`)
    .send({
      "description": "A new test description"
    })
    .expect(200);

  const responseThree = await request(app)
    .patch(`/api/product/blockage/${blockageCode.body.id}`)
    .send({
      "name": "TEM"
    })
    .expect(200);

  expect(responseOne.body.name).toEqual("DMG");
  expect(responseOne.body.version).toEqual(1);
  expect(responseTwo.body.description).toEqual("A new test description");
  expect(responseTwo.body.version).toEqual(2);
  expect(responseThree.body.name).toEqual("TEM");
  expect(responseThree.body.version).toEqual(3);
});

// --------------------

it("returns appropriate error when given invalid IDs", async () => {
  const inexistingID = "999";
  const invalidID = "notAnID";

  await request(app)
    .get(`/api/product/blockage/${inexistingID}`)
    .send()
    .expect(404);

  await request(app)
    .get(`/api/product/blockage/${invalidID}`)
    .send()
    .expect(400);

  await request(app)
    .patch(`/api/product/blockage/${inexistingID}`) 
    .send({
      "name": makeRandomString(3) 
    })
    .expect(404);

  await request(app)
    .patch(`/api/product/blockage/${invalidID}`)
    .send({
      "name": makeRandomString(3) 
    })
    .expect(400);

  await request(app)
    .delete(`/api/product/blockage/${inexistingID}`) 
    .send()
    .expect(404);

  await request(app)
    .delete(`/api/product/blockage/${invalidID}`)
    .send()
    .expect(400);
});

// --------------------

