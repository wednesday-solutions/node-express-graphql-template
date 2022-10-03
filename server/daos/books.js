import db from '@database/models';

export const insertBook = args => db.books.create(args);

export const updateBook = async ({ id, name, genres, pages, publisherId }) => {
  await db.books.update({ name, genres, pages, publisherId }, { where: { id } });

  return db.books.findOne({ where: { id } });
};
