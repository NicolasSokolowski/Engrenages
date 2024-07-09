import request from "supertest";
import { app } from "../app/index.app";

// Helper functions ---

function makeRandomString(length: number) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

// -------------------

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

// TESTS -------------

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

// -------------------

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

// -------------------

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

// -------------------

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

// -------------------

it("creates and delete a product", async () => {
  const product = await createProduct();

  const response = await request(app)
    .delete(`/api/product/${product.body.id}`)
    .send()
    .expect(200);

  await request(app)
    .get(`/api/product/${product.body.id}`)
    .send()
    .expect(404);
});

// -------------------

it("returns an error if given invalid input", async () => {
  const response = await request(app)
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

// -------------------


