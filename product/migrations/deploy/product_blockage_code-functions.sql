-- Deploy engrenages_product:product_blockage_code-functions to pg

BEGIN;

CREATE FUNCTION create_product_blockage_code(json) RETURNS TABLE (
  id INT,
  name VARCHAR(3),
  description VARCHAR(100)
) AS $$

  INSERT INTO "product_blockage_code"
  (
    "name",
    "description"
  ) VALUES (
    ($1->>'name')::VARCHAR(3),
    ($1->>'description')::VARCHAR(100)
  )
  RETURNING id, name, description

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION update_product_blockage_code(json, version INT) RETURNS TABLE (
    id INT,
    name VARCHAR(3),
    description VARCHAR(100),
    version INT,
    updated_at TIMESTAMPTZ
) AS $$

  UPDATE "product_blockage_code" SET (
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

CREATE FUNCTION delete_product_blockage_code(INT) RETURNS "product_blockage_code" AS $$

  DELETE FROM "product_blockage_code" WHERE "id" = $1
  RETURNING *;

$$ LANGUAGE SQL STRICT;

COMMIT;
