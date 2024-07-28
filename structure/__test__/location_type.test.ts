import { BadRequestError, makeRandomString } from "@zencorp/engrenages";
import { app } from "../app/index.app";
import jwt from "jsonwebtoken";
import request from "supertest";

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
};

export const createLocationType = async () => {
  return request(app)
    .post("/api/location/type")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      name: makeRandomString(5),
      description: makeRandomString(50),
      length: 120,
      width: 80,
      height: 190
    });  
}

// TESTS --------------

it("fetches all existing location types", async () => {
  await createLocationType();
  await createLocationType();
  await createLocationType();

  const response = await request(app)
    .get("/api/location/type")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(3);
});

// --------------------

it("creates a location type when given valid inputs", async () => {
  const response = await request(app)
    .post("/api/location/type")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "name": "R01",
      "description": "Emplacement multi picking",
      "length": 120,
      "width": 270,
      "height": 190
    })
    .expect(201);

  expect(response.body.name).toEqual("R01");
});

// --------------------

it("returns an error when given invalid inputs for the creation", async () => {
  await request(app)
    .post("/api/location/type")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "name": 1, // <-- Sending a number instead of a string
      "description": "Emplacement multi picking",
      "length": 120,
      "width": 270,
      "height": 190
    })
  .expect(400);
});

// --------------------

it("creates and updates a location when given valid inputs", async () =>  {
  const locationType = await createLocationType();

  const response = await request(app)
    .patch(`/api/location/type/${locationType.body.id}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "name": "R02"
    })
    .expect(200);

  expect(response.body.name).toEqual("R02");
});

// --------------------

it("returns an error when given invalid inputs for the update", async () => {
  const locationType = await createLocationType();

  await request(app)
    .patch(`/api/location/type/${locationType.body.id}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "name": "R02",
      "description": 342 // <-- Sending a number instead of a string
    })
    .expect(400);
});

// --------------------

it("creates, updates a location type several times and checks the version", async () => {
  const locationType = await createLocationType();

  const responseOne = await request(app)
    .patch(`/api/location/type/${locationType.body.id}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "name": "R02"
    })
    .expect(200);  

  const responseTwo = await request(app)
    .patch(`/api/location/type/${locationType.body.id}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "name": "R04"
    })
    .expect(200);  

  const responseThree = await request(app)
    .patch(`/api/location/type/${locationType.body.id}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "description": "Emplacement de masse"
    })
    .expect(200);  

  expect(responseOne.body.name).toEqual("R02");
  expect(responseOne.body.version).toEqual(1);
  expect(responseTwo.body.name).toEqual("R04");
  expect(responseTwo.body.version).toEqual(2);
  expect(responseThree.body.description).toEqual("Emplacement de masse");
  expect(responseThree.body.version).toEqual(3);
});

// --------------------

it("deletes a location type when given valid ID", async () => {
  const locationType = await createLocationType();
  
  await request(app)
    .delete(`/api/location/type/${locationType.body.id}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send()
    .expect(200);

  await request(app)
    .get(`/api/location/type/${locationType.body.id}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send()
    .expect(404);
});

// --------------------

it("returns appropriate status error when given invalid IDs", async () => {
  const inexistingID = "999";
  const invalidID = "notAnID";

  await request(app)
    .get(`/api/location/type/${inexistingID}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send()
    .expect(404);

  await request(app)
    .get(`/api/location/type/${invalidID}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send()
    .expect(400);

  await request(app)
    .patch(`/api/location/type/${inexistingID}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "name": makeRandomString(5) 
    })
    .expect(404);

  await request(app)
    .patch(`/api/location/type/${invalidID}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "name": makeRandomString(5) 
    })
    .expect(400);

  await request(app)
    .delete(`/api/location/type/${inexistingID}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`) 
    .send()
    .expect(404);

  await request(app)
    .delete(`/api/location/type/${invalidID}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send()
    .expect(400);
});

// --------------------

it("returns an error when trying to create an already existing location type (name)", async () => {
  const locationType = await createLocationType();

  await request(app)
    .post("/api/location/type")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`) 
    .send({
      "name": `${locationType.body.name}`,
      "description": "Emplacement étagère",
      "length": 120,
      "width": 80,
      "height": 190
    })
    .expect(400);
});

// --------------------