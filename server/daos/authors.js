import db from '@database/models';

export const insertAuthor = args => db.books.create(args);

export const updateAuthor = async ({ id, name, country, age }) => {
  await db.authors.update({ name, country, age }, { where: { id } });

  return db.authors.findOne({ where: { id } });
};
