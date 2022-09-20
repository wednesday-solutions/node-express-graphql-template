import db from '@database/models';

export const insertAuthor = args => db.books.create(args);

export const updateAuthor = async args => {
  const mapAuthorUpdateArgs = {
    name: args.name,
    country: args.country,
    age: args.age
  };

  const authorResponse = await db.authors.update(mapAuthorUpdateArgs, { where: { id: args.id } });

  console.log('authors response', authorResponse);

  const author = await db.authors.findOne({ where: { id: args.id } });

  return author;
};
