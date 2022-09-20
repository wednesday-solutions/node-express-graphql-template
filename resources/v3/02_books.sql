ALTER TABLE books
    ADD updated_at timestamp WITH time zone;

ALTER TABLE books
    ADD deleted_at timestamp WITH time zone;
