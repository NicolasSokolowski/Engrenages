-- Verify engrenages_product:table_creation on pg

BEGIN;

SELECT * FROM "product" WHERE false;

ROLLBACK;
