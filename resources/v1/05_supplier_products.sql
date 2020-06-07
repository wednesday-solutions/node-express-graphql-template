CREATE TABLE supplier_products
(
    id serial NOT NULL PRIMARY KEY,
    product_id integer NOT NULL,
    supplier_id integer NOT NULL,
    created_at timestamp
    WITH time zone DEFAULT NOW
    (),
    updated_at timestamp
    WITH time zone,
    deleted_at timestamp
    WITH time zone,
    CONSTRAINT suppliers_product_products_id FOREIGN KEY
    (product_id) REFERENCES products
    (id),
    CONSTRAINT suppliers_product_supplier_id FOREIGN KEY
    (supplier_id) REFERENCES suppliers
    (id)
);

