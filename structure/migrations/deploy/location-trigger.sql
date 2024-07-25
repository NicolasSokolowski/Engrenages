-- Deploy engrenages_structure:location-trigger to pg

BEGIN;

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

COMMIT;
