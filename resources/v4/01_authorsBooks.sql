CREATE TABLE authorsBooks (
  id SERIAL PRIMARY KEY,
  author_id int NOT NULL,
  book_id int NOT NULL,
  created_at timestamp 
    WITH time zone DEFAULT NOW
    (),
    updated_at timestamp
    WITH time zone,
    deleted_at timestamp
    WITH time zone,
    CONSTRAINT authorsBooks_books_id_fk FOREIGN KEY (book_id) REFERENCES books(id),
    CONSTRAINT authorsBooks_author_id_fk FOREIGN KEY (author_id) REFERENCES authors(id)  
);
