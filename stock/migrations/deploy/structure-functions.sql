-- Deploy engrenages_stock:structure-functions to pg

BEGIN;

CREATE FUNCTION create_location_blockage_type(json) RETURNS TABLE (
  id INT,
  name VARCHAR(3)
) AS $$

  INSERT INTO "location_blockage_type"
  (
    "name"
  ) VALUES (
    ($1->>'name')::VARCHAR(3)
  )
  RETURNING id, name

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION update_location_blockage_type(json, version INT) RETURNS TABLE (
    id INT,
    name VARCHAR(3),
    version INT,
    updated_at TIMESTAMPTZ
) AS $$

  UPDATE "location_blockage_type" SET (
    "name",
    "version",
    "updated_at"
  ) = (
    COALESCE(($1->>'name')::VARCHAR(3), "name"),
    ("version")::INT +1,
    NOW()
  )
  WHERE "id" = ($1->>'id')::INT AND "version" = ($2)
  RETURNING id, name, version, "updated_at"

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION delete_location_blockage_type(INT) RETURNS "location_blockage_type" AS $$

  DELETE FROM "location_blockage_type" WHERE "id" = $1
  RETURNING *;

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION create_location_type(json) RETURNS TABLE (
  id INT,
  name VARCHAR(5),
  length DECIMAL,
  width DECIMAL,
  height DECIMAL
) AS $$

  INSERT INTO "location_type"
  (
    "name",
    "length",
    "width",
    "height"
  ) VALUES (
    ($1->>'name')::VARCHAR(5),
    ($1->>'length')::DECIMAL,
    ($1->>'width')::DECIMAL,
    ($1->>'height')::DECIMAL
  )
  RETURNING id, name, length, width, height

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION update_location_type(json, version INT) RETURNS TABLE (
    id INT,
    name VARCHAR(5),
    length DECIMAL,
    width DECIMAL,
    height DECIMAL,
    version INT,
    updated_at TIMESTAMPTZ
) AS $$

  UPDATE "location_type" SET (
    "name",
    "length",
    "width",
    "height",
    "version",
    "updated_at"
  ) = (
    COALESCE(($1->>'name')::VARCHAR(5), "name"),
    COALESCE(($1->>'length')::DECIMAL, "length"),
    COALESCE(($1->>'width')::DECIMAL, "width"),
    COALESCE(($1->>'height')::DECIMAL, "height"),
    ("version")::INT +1,
    NOW()
  )
  WHERE "id" = ($1->>'id')::INT AND "version" = ($2)
  RETURNING id, name, length, width, height, version, "updated_at"

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION delete_location_type(INT) RETURNS "location_type" AS $$

  DELETE FROM "location_type" WHERE "id" = $1
  RETURNING *;

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION create_location(json) RETURNS TABLE (
  id INT,
  zone CHAR(1),
  alley CHAR(3),
  "position" CHAR(4),
  lvl CHAR(1),
  lvl_position CHAR(2),
  location CHAR(15),
  location_type_name CHAR(5),
  location_blockage_name CHAR(3)
) AS $$

  INSERT INTO "location"
  (
    "zone",
    "alley",
    "position",
    "lvl",
    "lvl_position",
    "location",
    "location_type_name",
    "location_blockage_name"
  ) VALUES (
    ($1->>'zone')::CHAR(1),
    ($1->>'alley')::CHAR(3),
    ($1->>'position')::CHAR(4),
    ($1->>'lvl')::CHAR(1),
    ($1->>'lvl_position')::CHAR(2),
    ($1->>'zone')::CHAR(1) || '-' || ($1->>'alley')::CHAR(3) || '-' || ($1->>'position')::CHAR(4) || '-' || ($1->>'lvl')::CHAR(1) || '-' || ($1->>'lvl_position')::CHAR(2),
    ($1->>'location_type_name')::CHAR(5),
    ($1->>'location_blockage_name')::CHAR(3)
  )
  RETURNING id, zone, alley, "position", lvl, lvl_position, location, location_type_name, location_blockage_name

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION update_location(json, version INT) RETURNS TABLE (
    id INT,
    zone CHAR(1),
    alley CHAR(3),
    "position" CHAR(4),
    lvl CHAR(1),
    lvl_position CHAR(2),
    location_type_name CHAR(5),
    location_blockage_name CHAR(3),
    version INT,
    updated_at TIMESTAMPTZ
) AS $$

  UPDATE "location" SET (
    "zone",
    "alley",
    "position",
    "lvl",
    "lvl_position",
    "location_type_name",
    "location_blockage_name",
    "version",
    "updated_at"
  ) = (
    COALESCE(($1->>'zone')::CHAR(1), "zone"),
    COALESCE(($1->>'alley')::CHAR(3), "alley"),
    COALESCE(($1->>'position')::CHAR(4), "position"),
    COALESCE(($1->>'lvl')::CHAR(1), "lvl"),
    COALESCE(($1->>'lvl_position')::CHAR(2), "lvl_position"),
    COALESCE(($1->>'location_type_name')::CHAR(5), "location_type_name"),
    COALESCE(($1->>'location_blockage_name')::CHAR(3), "location_blockage_name"),
    ("version")::INT +1,
    NOW()
  )
  WHERE "id" = ($1->>'id')::INT AND "version" = ($2)
  RETURNING id, zone, alley, "position", lvl, lvl_position, location_type_name, location_blockage_name, version, "updated_at"

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION delete_location(INT) RETURNS "location" AS $$

  DELETE FROM "location" WHERE "id" = $1
  RETURNING *;

$$ LANGUAGE SQL STRICT;


COMMIT;
