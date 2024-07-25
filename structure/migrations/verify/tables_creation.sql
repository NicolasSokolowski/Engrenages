-- Verify engrenages_structure:tables_creation on pg

BEGIN;

SELECT * FROM "location_type" WHERE FALSE;
SELECT * FROM "location_blockage_type" WHERE FALSE;
SELECT * FROM "location" WHERE FALSE;

ROLLBACK;
