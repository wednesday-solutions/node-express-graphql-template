import db from '@database/models';
import { isEmpty } from 'lodash';

export const insertAuthorsBooks = async args => {
  if (!isEmpty(args.authorsBooks)) {
    const mapAuthorBooksArgs = args.authorsBooks.map((item, index) => ({
      bookId: args.bookId,
      authorId: item.authorId
    }));

    const res = await db.authorsBooks.bulkCreate(mapAuthorBooksArgs);

    return res;
  }
};

export const updateAuthorsBooks = async args => {
  if (!isEmpty(args.authorsBooks)) {
    const mapAuthorBooksArgs = args.authorsBooks.map((item, index) => ({
      bookId: args.bookId,
      authorId: item.authorId
    }));

    const res = await db.authorsBooks.bulkCreate(mapAuthorBooksArgs);
    return res;
  }
};
