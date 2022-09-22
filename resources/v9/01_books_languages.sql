CREATE TABLE books_languages (
  id SERIAL PRIMARY KEY,
  language_id integer NOT NULL,
  book_id integer NOT NULL,
  created_at timestamp 
    WITH time zone DEFAULT NOW
    (),
    updated_at timestamp
    WITH time zone,
    deleted_at timestamp
    WITH time zone,
    CONSTRAINT books_languages_book_id_fk FOREIGN KEY (book_id) REFERENCES books(id),
    CONSTRAINT books_languages_language_id_fk FOREIGN KEY (language_id) REFERENCES languages(id)  
);
