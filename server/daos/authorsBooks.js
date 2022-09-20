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

export const updateAuthorsBooksForBooks = async args => {
  if (!isEmpty(args.authorsBooks)) {
    const mapAuthorBooksArgs = args.authorsBooks.map((item, index) => ({
      bookId: args.bookId,
      authorId: item.authorId
    }));

    await db.authorsBooks.destroy({ where: { bookId: args.bookId } });

    const res = await db.authorsBooks.bulkCreate(mapAuthorBooksArgs);

    return res;
  }
};

export const updateAuthorsBooksForAuthors = async args => {
  if (!isEmpty(args.authorsBooks)) {
    const mapAuthorBooksArgs = args.authorsBooks.map((item, index) => ({
      bookId: item.bookId,
      authorId: args.authorId
    }));

    await db.authorsBooks.destroy({ where: { authorId: args.authorId } });

    const res = await db.authorsBooks.bulkCreate(mapAuthorBooksArgs);

    return res;
  }
};
