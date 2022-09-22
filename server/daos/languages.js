import db from '@database/models';

export const insertLanguage = args => db.books.create(args);

export const updateLanguage = async args => {
  const mapLanguageUpdateArgs = {
    name: args.name,
    country: args.country
  };

  const languageResponse = await db.languages.update(mapLanguageUpdateArgs, { where: { id: args.id } });

  console.log('languages response', languageResponse);

  const language = await db.languages.findOne({ where: { id: args.id } });

  return language;
};
