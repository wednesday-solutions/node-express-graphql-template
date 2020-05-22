CREATE TABLE store_items (
    id serial NOT NULL PRIMARY KEY,
    item_id integer NOT NULL,
    store_id integer NOT NULL,
    created_at timestamp WITH time zone DEFAULT NOW(),
    updated_at timestamp WITH time zone,
    deleted_at timestamp WITH time zone,
    CONSTRAINT store_items_item_id FOREIGN KEY (item_id) REFERENCES items (id),
    CONSTRAINT store_items_store_id FOREIGN KEY (store_id) REFERENCES stores (id)
);

