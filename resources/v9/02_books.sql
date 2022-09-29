
ALTER TABLE books
    DROP CONSTRAINT books_language_id_fk;

ALTER TABLE books
    DROP COLUMN language_id;

    