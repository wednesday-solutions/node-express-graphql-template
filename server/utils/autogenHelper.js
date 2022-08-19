import fs from 'fs';
import path from 'path';
import pluralize from 'pluralize';

export const getGqlModels = ({ type, blacklist }) => {
  const getModelFiles = modelsFolderPath => {
    if (typeof modelsFolderPath !== 'string') {
      throw new Error('modelPathString is invalid');
    }
    return fs
      .readdirSync(modelsFolderPath)
      .filter(folder => {
        try {
          const f = fs.lstatSync(`${modelsFolderPath + folder}/index.js`);
          return f.isFile();
        } catch {}
        return false;
      })
      .filter(f => !blacklist.includes(f))
      .map(folder => `${folder}/index.js`);
  };
  const gqlModelsFolderPath = path.join(__dirname, '../gql/models/');

  const DB_TABLES = {};
  const fileArray = getModelFiles(gqlModelsFolderPath);
  fileArray.forEach(f => {
    const gqlModel = require(`../gql/models/${f}`);
    const name = pluralize.singular(f.split('/')[0].split('.')[0]);
    DB_TABLES[name] = gqlModel[`${name}${type}`];
  });
  return DB_TABLES;
};
