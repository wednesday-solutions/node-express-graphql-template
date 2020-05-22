CREATE TABLE items (
    id serial NOT NULL PRIMARY KEY,
    name text NOT NULL,
    category text NOT NULL,
    amount bigint NOT NULL,
    created_at timestamp WITH time zone DEFAULT NOW(),
    updated_at timestamp WITH time zone,
    deleted_at timestamp WITH time zone
);

CREATE INDEX items_name ON items USING btree (name);

CREATE INDEX items_category ON items USING btree (category);

