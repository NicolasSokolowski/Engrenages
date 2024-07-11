import request from "supertest";
import { app } from "../app/index.app";
import { makeRandomString } from "@zencorp/engrenages";

// Helper functions ---

const createProduct = async () => {
  return request(app)
    .post("/api/product")
    .send({
      title: makeRandomString(10),
      description: "Test Description",
      ean: makeRandomString(13),
      length: 12.23,
      width: 10.12,
      height: 8.50,
      product_img: "test_link",
      price: 23.70
    });
};

// TESTS --------------

it("fetches all the existing products", async () => {
  await createProduct();
  await createProduct();
  await createProduct();

  const response = await request(app)
    .get("/api/product")
    .send()
    .expect(200);

  expect(response.body.length).toEqual(3);
});

// --------------------

it("fetches a single product when given valid ID", async () => {
  const product = await createProduct();

  const response = await request(app)
    .get(`/api/product/${product.body.id}`)
    .send()
    .expect(200);

  expect(product.body.id).toEqual(response.body.id);
});

// --------------------

it("creates a product when given valid inputs", async () => {
  const response = await request(app)
    .post("/api/product")
    .send({
      title: "TEST Product",
      description: "Test Description",
      ean: "1235239233223",
      length: 12.23,
      width: 10.12,
      height: 8.50,
      product_img: "test_link",
      price: 23.70
    })
    .expect(201);

  expect(response.body.title).toEqual("TEST Product");
});

// --------------------

it("returns a 400 status error when trying to create a product if given invalid input", async () => {
  await request(app)
    .post("/api/product")
    .send({
      "title": 13, // <-- sending a number instead of a string
      "description": "Test Description",
      "ean": "1235239233223",
      "length": 12.23,
      "width": 10.12,
      "height": 8.50,
      "product_img": "test_link",
      "price": 23.70
    })
    .expect(400);
});

// --------------------

it("creates and updates a product", async () => {
  const product = await createProduct();

  const response = await request(app)
    .patch(`/api/product/${product.body.id}`)
    .send({
      "title": "product's title"
    })
    .expect(200);

  expect(response.body.title).toEqual("product's title");
  expect(response.body.version).toEqual(1);
});

// --------------------

it("returns a 400 status error when trying to update a product with invalid inputs", async () => {
  const product = await createProduct();

  await request(app)
    .patch(`/api/product/${product.body.id}`)
    .send({
      "title": 123 // <-- sending a number instead of a string
    })
    .expect(400);
});

// --------------------

it("creates and updates a product several times and checks the version", async () => {
  const product = await createProduct();

  const response = await request(app)
    .patch(`/api/product/${product.body.id}`)
    .send({
      "title": "Updated title"
    })
    .expect(200);

  const responseTwo = await request(app)
    .patch(`/api/product/${product.body.id}`)
    .send({
      "description": "Updated description"
    })
    .expect(200);

  const responseThree = await request(app)
    .patch(`/api/product/${product.body.id}`)
    .send({
      "ean": "2334532123454"
    })
    .expect(200);

  expect(response.body.title).toEqual("Updated title");
  expect(response.body.version).toEqual(1);
  expect(responseTwo.body.description).toEqual("Updated description");
  expect(responseTwo.body.version).toEqual(2);   
  expect(responseThree.body.ean).toEqual("2334532123454");
  expect(responseThree.body.version).toEqual(3);   
});

// --------------------

it("creates and delete a product", async () => {
  const product = await createProduct();

  await request(app)
    .delete(`/api/product/${product.body.id}`)
    .send()
    .expect(200);

  await request(app)
    .get(`/api/product/${product.body.id}`)
    .send()
    .expect(404);
});

// --------------------

it("returns appropriate status error when given invalid IDs", async () => {
  const inexistingID = "999";
  const invalidID = "notAnID";

  await request(app)
    .get(`/api/product/${inexistingID}`)
    .send()
    .expect(404);

  await request(app)
    .get(`/api/product/${invalidID}`)
    .send()
    .expect(400);

  await request(app)
    .patch(`/api/product/${inexistingID}`) 
    .send({
      "title": makeRandomString(10) 
    })
    .expect(404);

  await request(app)
    .patch(`/api/product/${invalidID}`)
    .send({
      "title": makeRandomString(10) 
    })
    .expect(400);

  await request(app)
    .delete(`/api/product/${inexistingID}`) 
    .send()
    .expect(404);

  await request(app)
    .delete(`/api/product/${invalidID}`)
    .send()
    .expect(400);
});

// --------------------

it("returns a 404 status error when using an invalid URL", async () => {
  await request(app)
    .get("/api/unknownURL") // <-- using an inexisting URL
    .send()
    .expect(404);
});

// --------------------


