-- Revert engrenages_auth:user-functions from pg

BEGIN;

DROP FUNCTION create_user(json);
DROP FUNCTION update_user(json, version INT);
DROP FUNCTION delete_user(INT);

COMMIT;
