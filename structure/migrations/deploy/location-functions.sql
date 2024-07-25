-- Deploy engrenages_structure:location-functions to pg

BEGIN;

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
