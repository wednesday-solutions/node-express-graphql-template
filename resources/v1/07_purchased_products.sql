CREATE TABLE purchased_products
(
    id serial NOT NULL PRIMARY KEY,
    product_id integer NOT NULL,
    price integer NOT NULL,
    discount integer NOT NULL,
    delivery_date timestamp
    WITH time zone NOT NULL,
    created_at timestamp
    WITH time zone DEFAULT NOW(),
    updated_at timestamp
    WITH time zone,
    deleted_at timestamp
    WITH time zone,
    CONSTRAINT purchased_products_product_id FOREIGN KEY
    (product_id) REFERENCES products
    (id)
);

    CREATE INDEX suppliers_delivery_date ON purchased_products USING btree
    (delivery_date);

