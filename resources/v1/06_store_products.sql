CREATE TABLE store_products
(
    id serial NOT NULL PRIMARY KEY,
    product_id integer NOT NULL,
    store_id integer NOT NULL,
    created_at timestamp
    WITH time zone DEFAULT NOW
    (),
    updated_at timestamp
    WITH time zone,
    deleted_at timestamp
    WITH time zone,
    CONSTRAINT store_products_product_id FOREIGN KEY
    (product_id) REFERENCES products
    (id),
    CONSTRAINT store_products_store_id FOREIGN KEY
    (store_id) REFERENCES stores
    (id)
);

