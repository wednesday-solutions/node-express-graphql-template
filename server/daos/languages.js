import db from '@database/models';
import { logger } from '@utils/index';

export const insertLanguage = args => db.books.create(args);

export const updateLanguage = async ({ id, language }) => {
  const languageResponse = await db.languages.update({ language }, { where: { id } });

  logger().info(languageResponse);

  return db.languages.findOne({ where: { id } });
};
