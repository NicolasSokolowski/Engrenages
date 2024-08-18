-- Revert engrenages_structure:location_type-functions from pg

BEGIN;

DROP FUNCTION create_location_type(json);
DROP FUNCTION update_location_type(json, version INT);
DROP FUNCTION delete_location_type(INT);

COMMIT;
