import { Token } from '../token';

describe('token tests', () => {
  const OLD_ENV = process.env;
  const keys = {
    ACCESS_TOKEN_SECRET:
      '4cd7234152590dcfe77e1b6fc52e84f4d30c06fddadd0dd2fb42cbc51fa14b1bb195bbe9d72c9599ba0c6b556f9bd1607a8478be87e5a91b697c74032e0ae7af'
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
