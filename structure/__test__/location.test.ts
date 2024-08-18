import request from "supertest";
import { app } from "../app/index.app";
import { makeRandomString } from "@zencorp/engrenages";
import { createLocationType, generateAccessToken, generateRefreshToken } from "./location_type.test";

// Helper functions ---

export const createLocation = async () => {
  const locationType = await createLocationType();

  return request(app)
    .post("/api/location")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "zone": makeRandomString(1),
      "alley": makeRandomString(3),
      "position": makeRandomString(4),
      "lvl": makeRandomString(1),
      "lvl_position": makeRandomString(2),
      "location_type_name": `${locationType.body.name}`
    });
};

// TESTS --------------

it("fetches all existing location", async () => {
  await createLocation();
  await createLocation();
  await createLocation();

  const response = await request(app)
    .get("/api/location")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(3);
});

// --------------------

it("creates a location when given valid inputs", async () => {
  const locationType = await createLocationType();

  const response = await request(app)
    .post("/api/location")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "zone": "B",
      "alley": "201",
      "position": "1111",
      "lvl": "C",
      "lvl_position": "02",
      "location_type_name": `${locationType.body.name}`
    })
    .expect(201);

  expect(response.body.zone).toEqual("B");
});

// --------------------

it("returns an error when given invalid inputs for the creation", async () => {
  const locationType = await createLocationType();

  await request(app)
    .post("/api/location")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "zone": "B",
      "alley": "201",
      "position": 1111, // <-- Sending a number instead of a string
      "lvl": "C",
      "lvl_position": "02",
      "location_type_name": `${locationType.body.location_type_name}`
    })
    .expect(400);
});

// --------------------

it("creates and updates a location when given valid inputs", async () => {
  const location = await createLocation();

  const response = await request(app)
    .patch(`/api/location/${location.body.id}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "zone": "C"
    })
    .expect(200);

  expect(response.body.zone).toEqual("C");
});

// --------------------

it("returns an error when given invalid inputs for the update", async () => {
  const location = await createLocation();

  await request(app)
    .patch(`/api/location/${location.body.id}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "alley": 123 // <-- Sending a number instead of a string
    })
    .expect(400);
});

// --------------------

it("creates, updates a location several times and checks the version", async () => {
  const location = await createLocation();

  const responseOne = await request(app)
    .patch(`/api/location/${location.body.id}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "alley": "234"
    })
    .expect(200);

    const responseTwo = await request(app)
    .patch(`/api/location/${location.body.id}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "position": "1234"
    })
    .expect(200);

    const responseThree = await request(app)
    .patch(`/api/location/${location.body.id}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "lvl": "D"
    })
    .expect(200);

  expect(responseOne.body.alley).toEqual("234");
  expect(responseOne.body.version).toEqual(1);
  expect(responseTwo.body.position).toEqual("1234");
  expect(responseTwo.body.version).toEqual(2);
  expect(responseThree.body.lvl).toEqual("D");
  expect(responseThree.body.version).toEqual(3);
});

// --------------------

it("deletes a location when given valid inputs", async () => {
  const location = await createLocation();

  await request(app)
    .delete(`/api/location/${location.body.id}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send()
    .expect(200);

  await request(app)
    .get(`/api/location/${location.body.id}`)
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
    .get(`/api/location/${inexistingID}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send()
    .expect(404);

  await request(app)
    .get(`/api/location/${invalidID}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send()
    .expect(400);

  await request(app)
    .patch(`/api/location/${inexistingID}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "zone": makeRandomString(1) 
    })
    .expect(404);

  await request(app)
    .patch(`/api/location/${invalidID}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "alley": makeRandomString(3) 
    })
    .expect(400);

  await request(app)
    .delete(`/api/location/${inexistingID}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`) 
    .send()
    .expect(404);

  await request(app)
    .delete(`/api/location/${invalidID}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send()
    .expect(400);
});

// --------------------

it("returns an error when trying to create and already existing location", async () => {
  const location = await createLocation();

  await request(app)
    .post("/api/location")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "zone": `${location.body.zone}`,
      "alley": `${location.body.alley}`,
      "position": `${location.body.position}`,
      "lvl": `${location.body.lvl}`,
      "lvl_position": `${location.body.lvl}`,
      "location_type_name": `${location.body.location_type_name}`
    })
    .expect(400);
});

// --------------------