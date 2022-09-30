import db from '@database/models';
import { logger } from '@utils/index';

export const insertLanguage = args => db.books.create(args);

export const updateLanguage = async args => {
  const mapLanguageUpdateArgs = {
    language: args.language
  };

  const languageResponse = await db.languages.update(mapLanguageUpdateArgs, { where: { id: args.id } });

  logger().info(languageResponse);

  return db.languages.findOne({ where: { id: args.id } });
};
