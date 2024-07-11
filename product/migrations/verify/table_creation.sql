-- Verify engrenages_product:table_creation on pg

BEGIN;

SELECT * FROM "product" WHERE false;
SELECT * FROM "product_blockage_code" WHERE false;

ROLLBACK;
