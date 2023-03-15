CREATE TABLE addresses (
    id serial NOT NULL PRIMARY KEY,
    address_1 text NOT NULL,
    address_2 text NOT NULL,
    city text NOT NULL,
    country text NOT NULL,
    latitude float8 NOT NULL,
    longitude float8 NOT NULL,
    created_at timestamp WITH time zone DEFAULT NOW(),
    updated_at timestamp WITH time zone,
    deleted_at timestamp WITH time zone
);

CREATE INDEX addresses_latitude ON addresses USING btree (latitude);

CREATE INDEX addresses_longitude ON addresses USING btree (longitude);

