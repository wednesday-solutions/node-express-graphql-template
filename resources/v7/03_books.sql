ALTER TABLE books
    DROP COLUMN published_by;

ALTER TABLE books
    ADD publisher_id int NOT NULL;

ALTER TABLE books
    ADD CONSTRAINT books_publisher_id_fk FOREIGN KEY(publisher_id) REFERENCES publishers(id);
    