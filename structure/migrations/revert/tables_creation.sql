-- Revert engrenages_structure:tables_creation from pg

BEGIN;

DROP TABLE "location", "location_blockage_type", "location_type";

COMMIT;
