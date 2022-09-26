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

export const queryUsingLanguage = async language => {
  let queriedRows;

  try {
    const getLanguage = await db.languages.findOne({ where: { language } });
    const getLanguageId = getLanguage.id;
    const getBooksLanguages = await db.booksLanguages.findOne({ where: { language_id: getLanguageId } });
    const getBooksId = getBooksLanguages.id;

    queriedRows = await db.books.findAll({ where: { id: getBooksId } });
  } catch (e) {
    throw new Error(`Failed to find the books written in ${language}`);
  }
  if (!queriedRows) {
    throw new Error('Data not found');
  }
  return queriedRows;
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

export const queryUsingPublishers = async publisher => {
  let queriedRows;

  try {
    const getPublisher = await db.publishers.findOne({ where: { name: publisher } });
    const getPublisherId = getPublisher.id;

    queriedRows = await db.books.findAll({ where: { publisherId: getPublisherId } });
  } catch (e) {
    throw new Error(`Failed to find the books published by ${publisher}`);
  }
  if (!queriedRows) {
    throw new Error('Data not found');
  }
  return queriedRows;
};
