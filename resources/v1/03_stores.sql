CREATE TABLE stores (
    id serial NOT NULL PRIMARY KEY,
    name text NOT NULL,
    address_id integer NOT NULL,
    created_at timestamp WITH time zone DEFAULT NOW(),
    updated_at timestamp WITH time zone,
    deleted_at timestamp WITH time zone,
    CONSTRAINT stores_address_id FOREIGN KEY(address_id) REFERENCES addresses (id)
);

CREATE INDEX store_name ON stores USING btree (name);

