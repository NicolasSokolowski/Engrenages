import request from "supertest";
import { app } from "../app/index.app";
import { makeRandomString } from "@zencorp/engrenages";
import { createLocationType, generateAccessToken, generateRefreshToken } from "./location_type.test";

// Helper functions ---

export const createLocationBlockageType = async () => {
  return request(app)
    .post("/api/location/blockage")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "name": makeRandomString(3),
      "description": makeRandomString(50)
    });
}

// TESTS --------------

it("fetches all existing location blockage types", async () => {
  await createLocationBlockageType();
  await createLocationBlockageType();
  await createLocationBlockageType();

  const response = await request(app)
    .get("/api/location/blockage")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send()    
    .expect(200);

  expect(response.body.length).toEqual(3);
});

// --------------------

it("creates a location blockage type when given valid inputs", async () => {
  const response = await request(app)
    .post("/api/location/blockage")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "name": "BLO",
      "description": "Emplacement bloqué"
    })
    .expect(201);

  expect(response.body.name).toEqual("BLO");
});

// --------------------

it("returns an error when given invalid inputs for the creation", async () => {
  await request(app)
    .post("/api/location/blockage")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "name": 123, // <-- Sending a number instead of a string
      "description": "Emplacement bloqué"
    })
    .expect(400);  
});

// --------------------

it("creates and updates a location blockage type when given valid inputs", async () => {
  const blockage = await createLocationBlockageType();

  const response = await request(app)
    .patch(`/api/location/blockage/${blockage.body.id}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)    
    .send({
      "name": "DMG"
    })
    .expect(200);

  expect(response.body.name).toEqual("DMG");
});

// --------------------

it("returns an error when given invalid inputs for the update", async () => {
  const blockage = await createLocationBlockageType();

  await request(app)
    .patch(`/api/location/blockage/${blockage.body.id}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)    
    .send({
      "name": 123 // <-- Sending a number instead of a string
    })
    .expect(400);  
});

// --------------------

it("creates, updates a location blockage type type several times and checks the version", async () => {
  const blockage = await createLocationBlockageType();

  const responseOne = await request(app)
    .patch(`/api/location/blockage/${blockage.body.id}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)    
    .send({
      "name": "RIA"
    })
    .expect(200);

  const responseTwo = await request(app)
    .patch(`/api/location/blockage/${blockage.body.id}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)    
    .send({
      "name": "FIR"
    })
    .expect(200);

  const responseThree = await request(app)
    .patch(`/api/location/blockage/${blockage.body.id}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)    
    .send({
      "name": "LIT"
    })
    .expect(200);

  expect(responseOne.body.name).toEqual("RIA");
  expect(responseOne.body.version).toEqual(1);
  expect(responseTwo.body.name).toEqual("FIR");
  expect(responseTwo.body.version).toEqual(2);
  expect(responseThree.body.name).toEqual("LIT");
  expect(responseThree.body.version).toEqual(3);

});

// --------------------

it("returns appropriate status error when given invalid IDs", async () => {
  const inexistingID = "999";
  const invalidID = "notAnID";

  await request(app)
    .get(`/api/location/blockage/${inexistingID}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send()
    .expect(404);

  await request(app)
    .get(`/api/location/blockage/${invalidID}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send()
    .expect(400);

  await request(app)
    .patch(`/api/location/blockage/${inexistingID}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "name": makeRandomString(3) 
    })
    .expect(404);

  await request(app)
    .patch(`/api/location/blockage/${invalidID}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "name": makeRandomString(3) 
    })
    .expect(400);

  await request(app)
    .delete(`/api/location/blockage/${inexistingID}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`) 
    .send()
    .expect(404);

  await request(app)
    .delete(`/api/location/blockage/${invalidID}`)
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send()
    .expect(400);
});

// --------------------

it("returns an error when trying to create an already existing blockage type (name)", async () => {
  const blockage = await createLocationBlockageType();

  await request(app)
    .post("/api/location/blockage")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "name": `${blockage.body.name}`,
      "description": `${blockage.body.description}`
    })
    .expect(400);
});

// --------------------

it("creates a location and updates it with a blockage type", async () => {
  const locationType = await createLocationType();

  const locationBlockageType = await request(app)
    .post("/api/location/blockage")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)
    .send({
      "name": "PNT",
      "description": "Pont"
    })
    .expect(201);

  await request(app)
    .post("/api/location")
    .set("authorization", `${await generateAccessToken()}`)
    .set("x-refresh-token", `${await generateRefreshToken()}`)  
    .send({
      "zone": makeRandomString(1),
      "alley": makeRandomString(3),
      "position": makeRandomString(4),
      "lvl": makeRandomString(1),
      "lvl_position": makeRandomString(2),
      "location_type_name": `${locationType.body.name}`,
      "location_blockage_type": `${locationBlockageType.body.name}`
    });
});

// --------------------