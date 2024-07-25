-- Deploy engrenages_structure:location_type-functions to pg

BEGIN;

CREATE FUNCTION create_location_type(json) RETURNS TABLE (
  id INT,
  name VARCHAR(5),
  description VARCHAR(100),
  length DECIMAL,
  width DECIMAL,
  height DECIMAL
) AS $$

  INSERT INTO "location_type"
  (
    "name",
    "description",
    "length",
    "width",
    "height"
  ) VALUES (
    ($1->>'name')::VARCHAR(5),
    ($1->>'description')::VARCHAR(100),
    ($1->>'length')::DECIMAL,
    ($1->>'width')::DECIMAL,
    ($1->>'height')::DECIMAL
  )
  RETURNING id, name, description, length, width, height

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION update_location_type(json, version INT) RETURNS TABLE (
    id INT,
    name VARCHAR(5),
    description VARCHAR(100),
    length DECIMAL,
    width DECIMAL,
    height DECIMAL,
    version INT,
    updated_at TIMESTAMPTZ
) AS $$

  UPDATE "location_type" SET (
    "name",
    "description",
    "length",
    "width",
    "height",
    "version",
    "updated_at"
  ) = (
    COALESCE(($1->>'name')::VARCHAR(5), "name"),
    COALESCE(($1->>'description')::VARCHAR(100), "description"),
    COALESCE(($1->>'length')::DECIMAL, "length"),
    COALESCE(($1->>'width')::DECIMAL, "width"),
    COALESCE(($1->>'height')::DECIMAL, "height"),
    ("version")::INT +1,
    NOW()
  )
  WHERE "id" = ($1->>'id')::INT AND "version" = ($2)
  RETURNING id, name, description, length, width, height, version, "updated_at"

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION delete_location_type(INT) RETURNS "location_type" AS $$

  DELETE FROM "location_type" WHERE "id" = $1
  RETURNING *;

$$ LANGUAGE SQL STRICT;

COMMIT;
