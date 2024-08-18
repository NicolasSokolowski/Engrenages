-- Revert engrenages_auth:tables_creation from pg

BEGIN;

DROP TABLE "user", "role";

COMMIT;
