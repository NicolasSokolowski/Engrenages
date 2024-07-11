-- Revert engrenages_product:product_blockage_code-functions from pg

BEGIN;

DROP FUNCTION create_product_blockage_code(json);
DROP FUNCTION update_product_blockage_code(json, version INT);
DROP FUNCTION delete_product_blockage_code(INT);

COMMIT;
