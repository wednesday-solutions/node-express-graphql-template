import { Token } from '../token';

describe('token tests', () => {
  const OLD_ENV = process.env;
  const keys = {
    ACCESS_TOKEN_SECRET: '4cd7234152590dcfe77e1b6fc52e84f4d30c06fddadd0dd2fb42cb'
  };

  beforeEach(() => {
    process.env = { ...OLD_ENV, ...keys };
  });
  afterAll(() => {
    process.env = OLD_ENV;
  });
  it('should return error if there is not any user', () => {
    const user = { id: 1 };
    const signedToken = new Token({ user }).get();
    expect(signedToken).not.toBeUndefined();
  });
});
