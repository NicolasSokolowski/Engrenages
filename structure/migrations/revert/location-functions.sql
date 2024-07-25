-- Revert engrenages_structure:location-functions from pg

BEGIN;

DROP FUNCTION create_location(json);
DROP FUNCTION update_location(json, version INT);
DROP FUNCTION delete_location(INT);

COMMIT;
