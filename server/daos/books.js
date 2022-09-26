import db from '@database/models';

export const insertBook = args => db.books.create(args);

export const updateBook = async args => {
  const mapBookUpdateArgs = {
    name: args.name,
    genres: args.genres,
    pages: args.pages
  };

  await db.books.update(mapBookUpdateArgs, { where: { id: args.id } });
  const book = await db.books.findOne({ where: { id: args.id } });

  return book;
};

export const queryUsingGenres = async genres => {
  let queriedRows;

  try {
    queriedRows = await db.books.findAll({ where: { genres } });
  } catch (e) {
    throw new Error(`Failed to find the books written in ${genres}`);
  }
  if (!queriedRows) {
    throw new Error('Data not found');
  }

  return queriedRows;
};
