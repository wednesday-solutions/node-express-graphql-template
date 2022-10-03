import db from '@database/models';
import { insertAuthor } from '../authors';

describe('Authors dao tests', () => {
  it('should create authors', async () => {
    const name = 'sagar';
    const country = 'India';
    const age = '24';

    const authorArgs = {
      name,
      country,
      age
    };

    const mock = jest.spyOn(db.authors, 'create');
    await insertAuthor(authorArgs);
    expect(mock).toHaveBeenCalledWith(authorArgs);
  });
});
