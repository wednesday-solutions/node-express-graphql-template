ALTER TABLE authors_books
  ADD CONSTRAINT UC_author_id_book_id UNIQUE (author_id, book_id)