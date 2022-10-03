import db from '@database/models';

export const insertAuthorsBooks = async args => db.authorsBooks.bulkCreate(args);

export const updateAuthorsBooksForBooks = async args =>
  db.authorsBooks.bulkCreate(args, {
    fields: ['id', 'bookId', 'authorId'],
    updateOnDuplicate: ['bookId']
  });

export const updateAuthorsBooksForAuthors = async args =>
  db.authorsBooks.bulkCreate(args, {
    fields: ['id', 'bookId', 'authorId'],
    updateOnDuplicate: ['authorId']
  });
