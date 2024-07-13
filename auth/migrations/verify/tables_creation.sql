-- Verify engrenages_auth:tables_creation on pg

BEGIN;

SELECT * FROM "role" WHERE false;
SELECT * FROM "user" WHERE false;

ROLLBACK;
