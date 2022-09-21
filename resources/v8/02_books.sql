
ALTER TABLE books
    ADD language_id int NOT NULL;

ALTER TABLE books
    ADD CONSTRAINT books_language_id_fk FOREIGN KEY(language_id) REFERENCES languages(id);
    