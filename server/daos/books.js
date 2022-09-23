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

export const queryUsingLanguage = async (affectedRows, language) => {
  //   let affectedRows;
  try {
    affectedRows = await db.books.findAll({
      include: [
        {
          model: db.languages,
          through: { where: { language } }
        }
      ]
    });
    console.log('affected rows', affectedRows);
  } catch (e) {
    throw new Error(`Failed to find the books written in ${language}`);
  }
  if (!affectedRows) {
    throw new Error('Data not found');
  }
  return affectedRows;
};

export const queryUsingGenres = async (affectedRows, genres) => {
  //   let affectedRows;
  console.log('result', affectedRows);
  try {
    affectedRows = await db.books.findAll({ where: { genres } });
  } catch (e) {
    throw new Error(`Failed to find the books written in ${genres}`);
  }
  if (!affectedRows) {
    throw new Error('Data not found');
  }
  console.log('genres result', affectedRows);
  return affectedRows;
};

export const queryUsingPublishers = async (affectedRows, publisher) => {
  //   let affectedRows;
  try {
    const getPublisherId = await db.publishers.findOne({ where: { name: publisher } });

    console.log('publisher id', getPublisherId);

    affectedRows = await db.books.findAll({ where: { publisherId: getPublisherId } });
  } catch (e) {
    throw new Error(`Failed to find the books published by ${publisher}`);
  }
  if (!affectedRows) {
    throw new Error('Data not found');
  }
  return affectedRows;
};
