-- Revert engrenages_stock:tables-creation from pg

BEGIN;

DROP TABLE "location", "location_blockage_type", "location_type", "product", "product_blockage_type";

COMMIT;
