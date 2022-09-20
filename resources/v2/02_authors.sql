CREATE TABLE authors
(
    id serial NOT NULL PRIMARY KEY,
    name text NOT NULL,
    created_at timestamp WITH time zone DEFAULT NOW(),
    country text NOT NULL,
    age integer NOT NULL,
    book_id integer NOT NULL,
    CONSTRAINT authors_book_id FOREIGN KEY(book_id) REFERENCES books (id)
);

CREATE INDEX authors_name ON authors USING btree (name);

CREATE INDEX authors_country ON authors USING btree (country);