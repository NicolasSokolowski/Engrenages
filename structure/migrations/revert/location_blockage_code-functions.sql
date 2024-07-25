-- Revert engrenages_structure:location_blockage_code-functions from pg

BEGIN;

DROP FUNCTION create_location_blockage_type(json);
DROP FUNCTION update_location_blockage_type(json, version INT);
DROP FUNCTION delete_location_blockage_type(INT);

COMMIT;
