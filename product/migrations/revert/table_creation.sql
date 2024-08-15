-- Revert engrenages_product:table_creation from pg

BEGIN;

DROP TABLE "product", "product_blockage_type";

COMMIT;
