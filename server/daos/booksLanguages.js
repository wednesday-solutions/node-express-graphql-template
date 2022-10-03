import db from '@database/models';

export const insertBooksLanguages = args => db.booksLanguages.bulkCreate(args);

export const updateBooksLanguagesForBooks = async args =>
  db.booksLanguages.bulkCreate(args, {
    fields: ['id', 'bookId', 'languageId'],
    updateOnDuplicate: ['bookId']
  });

export const updateBooksLanguagesForLanguages = async args =>
  db.booksLanguages.bulkCreate(args, {
    fields: ['id', 'bookId', 'languageId'],
    updateOnDuplicate: ['languageId']
  });
