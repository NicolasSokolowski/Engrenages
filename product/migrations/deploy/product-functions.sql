-- Deploy engrenages_product:product_function to pg

BEGIN;

CREATE FUNCTION create_product(json) RETURNS TABLE (
  id INT,
  title VARCHAR(100),
  description TEXT,
  ean CHAR(13),
  length DECIMAL,
  width DECIMAL,
  height DECIMAL,
  product_img TEXT,
  price DECIMAL,
  product_blockage_name CHAR(3)
) AS $$

  INSERT INTO "product"
  (
    "title",
    "description",
    "ean",
    "length",
    "width",
    "height",
    "product_img",
    "price",
    "product_blockage_name"
  ) VALUES (
    ($1->>'title')::VARCHAR(100),
    ($1->>'description')::TEXT,
    ($1->>'ean')::VARCHAR(13),
    ($1->>'length')::DECIMAL,
    ($1->>'width')::DECIMAL,
    ($1->>'height')::DECIMAL,
    ($1->>'product_img')::TEXT,
    ($1->>'price')::DECIMAL,
    ($1->>'product_blockage_name')::CHAR(3)
  )
  RETURNING id, title, description, ean, length, width, height, product_img, price, product_blockage_name

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION update_product(json, version INT) RETURNS TABLE (
    id INT,
    title VARCHAR(100),
    description TEXT,
    ean CHAR(13),
    length DECIMAL,
    width DECIMAL,
    height DECIMAL,
    product_img TEXT,
    price DECIMAL,
    version INT,
    updated_at TIMESTAMPTZ
) AS $$

  UPDATE "product" SET (
    "title",
    "description",
    "ean",
    "length",
    "width",
    "height",
    "product_img",
    "price",
    "version",
    "updated_at"
  ) = (
    COALESCE(($1->>'title')::VARCHAR(100), "title"),
    COALESCE(($1->>'description')::TEXT, "description"),
    COALESCE(($1->>'ean')::VARCHAR(13), "ean"),
    COALESCE(($1->>'length')::DECIMAL, "length"),
    COALESCE(($1->>'width')::DECIMAL, "width"),
    COALESCE(($1->>'height')::DECIMAL, "height"),
    COALESCE(($1->>'product_img')::TEXT, "product_img"),
    COALESCE(($1->>'price')::DECIMAL, "price"),
    ("version")::INT +1,
    NOW()
  )
  WHERE "id" = ($1->>'id')::INT AND "version" = ($2)
  RETURNING id, title, description, ean, length, width, height, product_img, price, version, "updated_at"

$$ LANGUAGE SQL STRICT;

CREATE FUNCTION delete_product(INT) RETURNS "product" AS $$

  DELETE FROM "product" WHERE "id" = $1
  RETURNING *;

$$ LANGUAGE SQL STRICT;

COMMIT;
