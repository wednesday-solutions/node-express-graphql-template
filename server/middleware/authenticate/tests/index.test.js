import authenticateToken from '../index';

describe('authentication tests', () => {
  const req = {
    headers: {
      authorization: null
    }
  };
  const next = jest.fn();
  const OLD_ENV = process.env;
  const keys = {
    ACCESS_TOKEN_SECRET: '4cd7234152590dcfe77e1b6fc52e84f4d30c06fddadd0dd2'
  };

  beforeEach(() => {
    process.env = { ...OLD_ENV, ...keys };
  });
  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should ensure it return 401 when no token is available', async () => {
    const mockResponse = () => {
      const res = {};
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };
    const res = mockResponse();
    authenticateToken(req, res, next);
    expect(res.json).toBeCalledWith(401, { errors: ['Token not found!'] });
  });
});
