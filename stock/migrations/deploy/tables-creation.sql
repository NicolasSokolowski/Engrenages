-- Deploy engrenages_stock:tables-creation to pg

BEGIN;

CREATE TABLE "product_blockage_type" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" CHAR(3) NOT NULL UNIQUE,
  "version" INT DEFAULT 0,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "product" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "title" VARCHAR(100) NOT NULL UNIQUE,
  "ean" CHAR(13) NOT NULL UNIQUE,
  "length" DECIMAL(15,2) NOT NULL,
  "width" DECIMAL(15,2) NOT NULL,
  "height" DECIMAL(15,2) NOT NULL,
  "product_img" TEXT,
  "product_blockage_name" CHAR(3) DEFAULT NULL REFERENCES "product_blockage_type"("name"),
  "version" INT DEFAULT 0,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "location_type" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" VARCHAR(5) NOT NULL UNIQUE,
  "length" DECIMAL(15,2) NOT NULL,
  "width" DECIMAL(15,2) NOT NULL,
  "height" DECIMAL(15,2) NOT NULL,
  "version" INT DEFAULT 0,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "location_blockage_type" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" VARCHAR(3) NOT NULL UNIQUE,
  "version" INT DEFAULT 0,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "location" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "zone" CHAR(1) NOT NULL,
  "alley" CHAR(3) NOT NULL,
  "position" CHAR(4) NOT NULL,
  "lvl" CHAR(1) NOT NULL,
  "lvl_position" CHAR(2) NOT NULL,
  "location" CHAR(15) NOT NULL UNIQUE,
  "location_type_name" VARCHAR(5) NOT NULL REFERENCES location_type("name") ON UPDATE CASCADE ON DELETE CASCADE,
  "location_blockage_name" CHAR(3) DEFAULT NULL REFERENCES location_blockage_type("name") ON UPDATE CASCADE ON DELETE CASCADE,
  "ean" CHAR(13) DEFAULT NULL REFERENCES product("ean"),
  "quantity" INT DEFAULT NULL,
  "version" INT DEFAULT 0,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ
);

COMMIT;
