CREATE TABLE test_table (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL CHECK(name <> ''),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ,
  UNIQUE(name)
);

CREATE TRIGGER updated_at BEFORE UPDATE ON test_table
  FOR EACH ROW EXECUTE PROCEDURE updated_at();

INSERT INTO test_table (name)
  VALUES
  ('Foo'),
  ('Bar'),
  ('Baz');
