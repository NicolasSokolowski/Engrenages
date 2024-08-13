-- Deploy engrenages_stock:location-triggers to pg

BEGIN;

CREATE OR REPLACE FUNCTION insert_location_stock()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO stock(location)
    VALUES (NEW.location);

    RETURN NEW;
END;
$$ LANGUAGE PLPGSQL STRICT;

CREATE TRIGGER trigger_insert_location
AFTER INSERT ON location
FOR EACH ROW
EXECUTE FUNCTION insert_location_stock();

CREATE FUNCTION update_location_field()
RETURNS TRIGGER AS $$
BEGIN
  NEW.location := NEW.zone || '-' || NEW.alley || '-' || NEW.position || '-' || NEW.lvl || '-' || NEW.lvl_position;
  RETURN NEW;
END;
$$ LANGUAGE PLPGSQL STRICT;

CREATE TRIGGER trigger_update_location
BEFORE UPDATE ON location
FOR EACH ROW
WHEN (OLD.zone IS DISTINCT FROM NEW.zone OR 
      OLD.alley IS DISTINCT FROM NEW.alley OR 
      OLD.position IS DISTINCT FROM NEW.position OR 
      OLD.lvl IS DISTINCT FROM NEW.lvl OR 
      OLD.lvl_position IS DISTINCT FROM NEW.lvl_position)
EXECUTE FUNCTION update_location_field();

CREATE OR REPLACE FUNCTION update_stock_location()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.location IS DISTINCT FROM OLD.location THEN
        UPDATE stock
        SET location = NEW.location,
            updated_at = NOW()
        WHERE location = OLD.location;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE PLPGSQL STRICT;

CREATE TRIGGER trigger_update_location_stock
AFTER UPDATE ON location
FOR EACH ROW
EXECUTE FUNCTION update_stock_location();

CREATE OR REPLACE FUNCTION delete_location_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.ean IS NULL THEN
        DELETE FROM stock WHERE location = OLD.location;
        RETURN OLD;
    ELSE
        RAISE EXCEPTION 'Suppression annulée : emplacement occupé par %', OLD.ean;
    END IF;
END;
$$ LANGUAGE PLPGSQL STRICT;

CREATE TRIGGER trigger_delete_location
BEFORE DELETE ON location
FOR EACH ROW
EXECUTE FUNCTION delete_location_stock();

----------------

CREATE OR REPLACE FUNCTION update_location_type_location()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE location
    SET location_type_name = NEW.name,
        updated_at = NOW()
    WHERE location_type_name = OLD.name;

    RETURN NEW;
END;
$$ LANGUAGE PLPGSQL STRICT;

CREATE TRIGGER trigger_update_location_type_name
AFTER UPDATE ON location_type
FOR EACH ROW
EXECUTE FUNCTION update_location_type_location();


CREATE OR REPLACE FUNCTION delete_location_type_location()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM location WHERE location_type_name = OLD.name) THEN
        RAISE EXCEPTION 'Suppression annulée : le type de location "%" est encore utilisé dans la table location.', OLD.name;
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE PLPGSQL STRICT;

CREATE TRIGGER trigger_delete_location_type
BEFORE DELETE ON location_type
FOR EACH ROW
EXECUTE FUNCTION delete_location_type_location();


COMMIT;
