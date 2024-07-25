-- Revert engrenages_structure:location-trigger from pg

BEGIN;

DROP TRIGGER trigger_update_location ON location;

DROP FUNCTION update_location_field();

COMMIT;
