CREATE TABLE books
(
    id serial NOT NULL PRIMARY KEY,
    name text NOT NULL,
    genres text NOT NULL,
    created_at timestamp WITH time zone DEFAULT NOW(),
    pages integer NOT NULL,
    published_by text NOT NULL
);

CREATE INDEX books_genres ON books USING btree (genres);

CREATE INDEX books_name ON books USING btree (name);

CREATE INDEX books_published_by ON books USING btree (published_by);