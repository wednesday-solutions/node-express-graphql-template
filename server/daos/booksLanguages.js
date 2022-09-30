import db from '@database/models';
import { isEmpty } from 'lodash';

export const insertBooksLanguages = args => {
  if (!isEmpty(args.booksLanguages)) {
    const mapBooksLanguagesArgs = args.booksLanguages.map((item, index) => ({
      bookId: args.bookId,
      languageId: item.languageId
    }));

    return db.booksLanguages.bulkCreate(mapBooksLanguagesArgs);
  }
};

export const updateBooksLanguagesForBooks = async args => {
  if (!isEmpty(args.booksLanguages)) {
    const mapBooksLanguagesArgs = args.booksLanguages.map((item, index) => ({
      bookId: args.bookId,
      languageId: item.languageId
    }));

    return db.booksLanguages.bulkCreate(mapBooksLanguagesArgs, {
      fields: ['id', 'bookId', 'languageId'],
      updateOnDuplicate: ['bookId']
    });
  }
};

export const updateBooksLanguagesForLanguages = async args => {
  if (!isEmpty(args.booksLanguages)) {
    const mapBooksLanguagesArgs = args.booksLanguages.map((item, index) => ({
      bookId: item.bookId,
      languageId: args.languageId
    }));

    return db.booksLanguages.bulkCreate(mapBooksLanguagesArgs, {
      fields: ['id', 'bookId', 'languageId'],
      updateOnDuplicate: ['languageId']
    });
  }
};
