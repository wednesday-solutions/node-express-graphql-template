import db from '@database/models';

export const insertBook = args => db.books.create(args);

export const updateBook = async args => {
  const mapBookUpdateArgs = {
    name: args.name,
    genres: args.genres,
    pages: args.pages,
    publishedBy: args.publishedBy
  };

  const bookResponse = await db.books.update(mapBookUpdateArgs, { where: { id: args.id } });

  console.log('books response', bookResponse);

  const returnValue = await db.books.findOne({ where: { id: args.id } });

  return returnValue;
};
