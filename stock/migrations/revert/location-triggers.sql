-- Revert engrenages_stock:location-triggers from pg

BEGIN;

DROP TRIGGER trigger_delete_location_type ON location_type;
DROP FUNCTION delete_location_type_location();
DROP TRIGGER trigger_update_location_type_name ON location_type;
DROP FUNCTION update_location_type_location();

DROP TRIGGER trigger_delete_location ON location;
DROP FUNCTION delete_location_stock();
DROP TRIGGER trigger_update_location_stock ON location;
DROP FUNCTION update_stock_location();
DROP TRIGGER trigger_update_location ON location;
DROP FUNCTION update_location_field();
DROP TRIGGER trigger_insert_location ON location;
DROP FUNCTION insert_location_stock();

COMMIT;
