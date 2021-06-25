CREATE TABLE manufacturers (
  id SERIAL PRIMARY KEY, 
  name text NOT NULL, 
  origin_country text NOT NULL, 
  CONSTRAINT name_origin_country UNIQUE (name, origin_country)
);
CREATE INDEX manufacturers_name ON manufacturers USING btree (name);
