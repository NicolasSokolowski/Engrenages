-- Verify engrenages_stock:tables-creation on pg

BEGIN;

SELECT * FROM "product_blockage_type" WHERE false;
SELECT * FROM "product" WHERE false;
SELECT * FROM "location_blockage_type" WHERE false;
SELECT * FROM "location_type" WHERE false;
SELECT * FROM "location" WHERE false;
SELECT * FROM "stock" WHERE false;

ROLLBACK;
