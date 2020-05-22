CREATE TABLE addresses (
    id serial NOT NULL PRIMARY KEY,
    address_1 text NOT NULL,
    address_2 text NOT NULL,
    city text NOT NULL,
    country text NOT NULL,
    lat float8 NOT NULL,
    long float8 NOT NULL,
    created_at timestamp WITH time zone DEFAULT NOW(),
    updated_at timestamp WITH time zone,
    deleted_at timestamp WITH time zone
);

CREATE INDEX addresses_lat ON addresses USING btree (lat);

CREATE INDEX addresses_long ON addresses USING btree (long);

