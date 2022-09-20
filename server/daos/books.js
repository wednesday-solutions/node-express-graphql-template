import db from '@database/models';

export const insertBook = args => db.books.create(args);

export const updateBook = async args => {
  const mapBookUpdateArgs = {
    name: args.name,
    genres: args.genres,
    pages: args.pages,
    publishedBy: args.publishedBy
  };

  await db.books.update(mapBookUpdateArgs, { where: { id: args.id } });

  const book = await db.books.findOne({ where: { id: args.id } });

  return book;
};
