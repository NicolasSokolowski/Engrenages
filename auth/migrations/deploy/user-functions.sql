-- Deploy engrenages_auth:user-functions to pg

BEGIN;

CREATE FUNCTION create_user(json) RETURNS TABLE (
  id INT,
  first_name VARCHAR(20),
  last_name VARCHAR(50),
  email VARCHAR(100)
) AS $$

  INSERT INTO "user"
  (
    "first_name",
    "last_name",
    "email",
    "password",
    "role_name"
  ) VALUES (
    ($1->>'first_name')::VARCHAR(20),
    ($1->>'last_name')::VARCHAR(50),
    ($1->>'email')::VARCHAR(100),
    ($1->>'password')::VARCHAR(64),
    ($1->>'role_name')::VARCHAR(10)
  )
  RETURNING id, first_name, last_name, email

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION update_user(json, version INT) RETURNS TABLE (
    id INT,
    first_name VARCHAR(20),
    last_name VARCHAR(50),
    email VARCHAR(100),
    role_name VARCHAR(10),
    version INT,
    updated_at TIMESTAMPTZ
) AS $$

  UPDATE "user" SET (
    "first_name",
    "last_name",
    "email",
    "password",
    "role_name",
    "version",
    "updated_at"
  ) = (
    COALESCE(($1->>'first_name')::VARCHAR(20), "first_name"),
    COALESCE(($1->>'last_name')::VARCHAR(50), "last_name"),
    COALESCE(($1->>'email')::VARCHAR(100), "email"),
    COALESCE(($1->>'password')::VARCHAR(64), "password"),
    COALESCE(($1->>'role_name')::VARCHAR(10), "role_name"),
    ("version")::INT +1,
    NOW()
  )
  WHERE "id" = ($1->>'id')::INT AND "version" = ($2)
  RETURNING id, first_name, last_name, email, role_name, version, "updated_at"

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION delete_user(INT) RETURNS "user" AS $$

  DELETE FROM "user" WHERE "id" = $1
  RETURNING *;

$$ LANGUAGE SQL STRICT;

COMMIT;
