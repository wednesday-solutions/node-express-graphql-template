import db from '@database/models';
import { isEmpty } from 'lodash';

export const insertBooksLanguages = async args => {
  if (!isEmpty(args.booksLanguages)) {
    const mapBooksLanguagesArgs = args.booksLanguages.map((item, index) => ({
      bookId: args.bookId,
      languageId: item.languageId
    }));

    const res = await db.booksLanguages.bulkCreate(mapBooksLanguagesArgs);

    return res;
  }
};

export const updateBooksLanguagesForBooks = async args => {
  if (!isEmpty(args.booksLanguages)) {
    const mapBooksLanguagesArgs = args.booksLanguages.map((item, index) => ({
      bookId: args.bookId,
      languageId: item.languageId
    }));

    await db.booksLanguages.destroy({ where: { bookId: args.bookId } });

    const res = await db.booksLanguages.bulkCreate(mapBooksLanguagesArgs);

    return res;
  }
};

export const updateBooksLanguagesForLanguages = async args => {
  if (!isEmpty(args.booksLanguages)) {
    const mapBooksLanguagesArgs = args.booksLanguages.map((item, index) => ({
      bookId: item.bookId,
      languageId: args.languageId
    }));

    await db.booksLanguages.destroy({ where: { languageId: args.languageId } });

    const res = await db.booksLanguages.bulkCreate(mapBooksLanguagesArgs);

    return res;
  }
};
