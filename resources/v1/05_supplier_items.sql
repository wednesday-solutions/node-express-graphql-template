CREATE TABLE supplier_items (
    id serial NOT NULL PRIMARY KEY,
    item_id integer NOT NULL,
    supplier_id integer NOT NULL,
    created_at timestamp WITH time zone DEFAULT NOW(),
    updated_at timestamp WITH time zone,
    deleted_at timestamp WITH time zone,
    CONSTRAINT suppliers_item_items_id FOREIGN KEY (item_id) REFERENCES items (id),
    CONSTRAINT suppliers_item_supplier_id FOREIGN KEY (supplier_id) REFERENCES suppliers (id)
);

