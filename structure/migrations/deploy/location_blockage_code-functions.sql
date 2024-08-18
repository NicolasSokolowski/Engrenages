-- Deploy engrenages_structure:location_blockage_code-functions to pg

BEGIN;

CREATE FUNCTION create_location_blockage_type(json) RETURNS TABLE (
  id INT,
  name VARCHAR(3),
  description VARCHAR(100)
) AS $$

  INSERT INTO "location_blockage_type"
  (
    "name",
    "description"
  ) VALUES (
    ($1->>'name')::VARCHAR(3),
    ($1->>'description')::VARCHAR(100)
  )
  RETURNING id, name, description

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION update_location_blockage_type(json, version INT) RETURNS TABLE (
    id INT,
    name VARCHAR(3),
    description VARCHAR(100),
    version INT,
    updated_at TIMESTAMPTZ
) AS $$

  UPDATE "location_blockage_type" SET (
    "name",
    "description",
    "version",
    "updated_at"
  ) = (
    COALESCE(($1->>'name')::VARCHAR(3), "name"),
    COALESCE(($1->>'description')::VARCHAR(100), "description"),
    ("version")::INT +1,
    NOW()
  )
  WHERE "id" = ($1->>'id')::INT AND "version" = ($2)
  RETURNING id, name, description, version, "updated_at"

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION delete_location_blockage_type(INT) RETURNS "location_blockage_type" AS $$

  DELETE FROM "location_blockage_type" WHERE "id" = $1
  RETURNING *;

$$ LANGUAGE SQL STRICT;

COMMIT;
