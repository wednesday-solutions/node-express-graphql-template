CREATE TABLE purchased_items (
    id serial NOT NULL PRIMARY KEY,
    item_id integer NOT NULL,
    price integer NOT NULL,
    discount integer NOT NULL,
    delivery_date timestamp WITH time zone NOT NULL,
    created_at timestamp WITH time zone DEFAULT NOW(),
    updated_at timestamp WITH time zone,
    deleted_at timestamp WITH time zone,
    CONSTRAINT purchased_items_item_id FOREIGN KEY (item_id) REFERENCES items (id)
);

CREATE INDEX suppliers_delivery_date ON purchased_items USING btree (delivery_date);

