CREATE TABLE authors_books (
  id SERIAL PRIMARY KEY,
  author_id integer NOT NULL,
  book_id integer NOT NULL,
  created_at timestamp 
    WITH time zone DEFAULT NOW
    (),
    updated_at timestamp
    WITH time zone,
    deleted_at timestamp
    WITH time zone,
    CONSTRAINT authors_books_book_id_fk FOREIGN KEY (book_id) REFERENCES books(id),
    CONSTRAINT authors_books_author_id_fk FOREIGN KEY (author_id) REFERENCES authors(id)  
);
