ALTER TABLE books_languages 
  ADD CONSTRAINT UC_book_id_language_id UNIQUE (book_id, language_id)