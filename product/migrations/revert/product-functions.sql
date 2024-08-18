-- Revert engrenages_product:product_function from pg

BEGIN;

DROP FUNCTION create_product(json);
DROP FUNCTION update_product(json, version INT);
DROP FUNCTION delete_product(INT);

COMMIT;
