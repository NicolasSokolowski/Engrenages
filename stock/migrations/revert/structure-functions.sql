-- Revert engrenages_stock:structure-functions from pg

BEGIN;

DROP FUNCTION create_location(json);
DROP FUNCTION update_location(json, version INT);
DROP FUNCTION delete_location(INT);
DROP FUNCTION create_location_blockage_type(json);
DROP FUNCTION update_location_blockage_type(json, version INT);
DROP FUNCTION delete_location_blockage_type(INT);
DROP FUNCTION create_location_type(json);
DROP FUNCTION update_location_type(json, version INT);
DROP FUNCTION delete_location_type(INT);

COMMIT;
