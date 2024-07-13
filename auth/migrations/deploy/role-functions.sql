-- Deploy engrenages_auth:role-functions to pg

BEGIN;

CREATE FUNCTION create_role(json) RETURNS TABLE (
  id INT,
  name VARCHAR(10)
) AS $$

  INSERT INTO "role"
  (
    "name"
  ) VALUES (
    ($1->>'name')::VARCHAR(10)
  )
  RETURNING id, name

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION update_role(json, version INT) RETURNS TABLE (
    id INT,
    name VARCHAR(10),
    version INT,
    updated_at TIMESTAMPTZ
) AS $$

  UPDATE "role" SET (
    "name",
    "version",
    "updated_at"
  ) = (
    COALESCE(($1->>'name')::VARCHAR(10), "name"),
    ("version")::INT +1,
    NOW()
  )
  WHERE "id" = ($1->>'id')::INT AND "version" = ($2)
  RETURNING id, name, version, "updated_at"

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION delete_role(INT) RETURNS "role" AS $$

  DELETE FROM "role" WHERE "id" = $1
  RETURNING *;

$$ LANGUAGE SQL STRICT;

COMMIT;
