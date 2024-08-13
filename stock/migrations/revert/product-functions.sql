-- Revert engrenages_stock:product-functions from pg

BEGIN;

DROP FUNCTION create_product_blockage_type(json);
DROP FUNCTION update_product_blockage_type(json, version INT);
DROP FUNCTION delete_product_blockage_type(INT);
DROP FUNCTION create_product(json);
DROP FUNCTION update_product(json, version INT);
DROP FUNCTION delete_product(INT);

COMMIT;
