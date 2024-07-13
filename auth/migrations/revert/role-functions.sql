-- Revert engrenages_auth:role-functions from pg

BEGIN;

DROP FUNCTION create_role(json);
DROP FUNCTION update_role(json, version INT);
DROP FUNCTION delete_role(INT);

COMMIT;
