CREATE TABLE products
(
    id serial NOT NULL PRIMARY KEY,
    name text NOT NULL,
    category text NOT NULL,
    amount bigint NOT NULL,
    created_at timestamp
    WITH time zone DEFAULT NOW
    (),
    updated_at timestamp
    WITH time zone,
    deleted_at timestamp
    WITH time zone
);

    CREATE INDEX products_name ON products USING btree
    (name);

    CREATE INDEX products_category ON products USING btree
    (category);

