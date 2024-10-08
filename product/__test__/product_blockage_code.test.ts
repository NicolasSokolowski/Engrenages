import request from "supertest";
import { app } from "../app/index.app";
import { BadRequestError, makeRandomString } from "@zencorp/engrenages";
import jwt from "jsonwebtoken";

// Helper functions ---

export const generateAccessToken = async () => {
  if(!process.env.ACCESS_TOKEN_SECRET) {
    throw new BadRequestError("Access token secret must be set");
  }
  const secret = process.env.ACCESS_TOKEN_SECRET;

  const userPayload = {
    id: 1,
    email: "admin@test.com",
    role: "admin"
  };

  return jwt.sign(userPayload, secret);
}

export const generateRefreshToken = async () => {
  if(!process.env.REFRESH_TOKEN_SECRET) {
    throw new BadRequestError("Refresh token secret must be set");
  }
  const secret = process.env.REFRESH_TOKEN_SECRET;
  
  const userPayload = {
    id: 1,
    email: "admin@test.com",
    role: "admin"
  };

  return jwt.sign(userPayload, secret);
}

export const createBlockageCode = async () => {

  return request(app)
    .post("/api/product/blockage")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
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
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(3);
});

// --------------------

it("fetches a single product blockage type if given valid ID", async () => {
  const blockageCode = await createBlockageCode();

  const response = await request(app)
    .get(`/api/product/blockage/${blockageCode.body.id}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send()
    .expect(200);

  expect(response.body.name).toEqual(blockageCode.body.name);
});

// --------------------

it("creates a product blockage type when given valid inputs", async () => {
  const response = await request(app)
    .post("/api/product/blockage")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "name": "RIA",
      "description": "Blockage test description"
    })
    .expect(201);

  expect(response.body.name).toEqual("RIA");
  expect(response.body.description).toEqual("Blockage test description");
});

// --------------------

it("returns a 400 status error when trying to create a product blockage type with invalid inputs", async () => {
  await request(app)
    .post("/api/product/blockage")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
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
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "name": "FIR"
    })
    .expect(200);

  expect(response.body.name).toEqual("FIR");
});

// --------------------

it("returns a 400 error when trying to update a product blockage code with invalid inputs", async () => {
  const blockageCode = await createBlockageCode();

  await request(app)
    .patch(`/api/product/blockage/${blockageCode.body.id}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "description": makeRandomString(101) // <-- sending a 101 characters string instead of a max 100
    })
    .expect(400);
});

// --------------------

it("creates and deletes a product when given valid ID", async () => {
  const blockageCode = await createBlockageCode();

  await request(app)
    .delete(`/api/product/blockage/${blockageCode.body.id}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send()
    .expect(200);

  await request(app)
    .get(`/api/product/blockage/${blockageCode.body.id}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send()
    .expect(404);
});

// --------------------

it("creates and updates a product blockage type several type and checks the version", async () => {
  const blockageCode = await createBlockageCode();

  const responseOne = await request(app)
    .patch(`/api/product/blockage/${blockageCode.body.id}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "name": "DMG"
    })
    .expect(200);

  const responseTwo = await request(app)
    .patch(`/api/product/blockage/${blockageCode.body.id}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "description": "A new test description"
    })
    .expect(200);

  const responseThree = await request(app)
    .patch(`/api/product/blockage/${blockageCode.body.id}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
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
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send()
    .expect(404);

  await request(app)
    .get(`/api/product/blockage/${invalidID}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send()
    .expect(400);

  await request(app)
    .patch(`/api/product/blockage/${inexistingID}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "name": makeRandomString(3) 
    })
    .expect(404);

  await request(app)
    .patch(`/api/product/blockage/${invalidID}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "name": makeRandomString(3) 
    })
    .expect(400);

  await request(app)
    .delete(`/api/product/blockage/${inexistingID}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send()
    .expect(404);

  await request(app)
    .delete(`/api/product/blockage/${invalidID}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send()
    .expect(400);
});

// --------------------

it("creates a product blockage code and creates a product with the created code", async () => {
  const blockageName = await request(app)
    .post("/api/product/blockage")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "name": "PNT",
      "description": "Pont"
    })
    .expect(201);

  const product = await request(app)
    .post("/api/product")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "title": makeRandomString(10),
      "description": "Test Description",
      "ean": makeRandomString(13),
      "length": 12.23,
      "width": 10.12,
      "height": 8.50,
      "product_img": "test_link",
      "price": 23.70,
      "product_blockage_name": "PNT"
    })
    .expect(201);

  expect(product.body.product_blockage_name).toEqual(blockageName.body.name);
});

// --------------------

it("returns an error when trying to delete a product blockage code used by a product", async () => {
  const blockageName = await createBlockageCode();

  await request(app)
    .post("/api/product")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "title": makeRandomString(10),
      "description": "Test Description",
      "ean": makeRandomString(13),
      "length": 12.23,
      "width": 10.12,
      "height": 8.50,
      "product_img": "test_link",
      "price": 23.70,
      "product_blockage_name": `${blockageName.body.name}`     
    })
    .expect(201);

  await request(app)
    .delete(`/api/product/blockage/${blockageName.body.id}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send()
    .expect(400);
});

// --------------------