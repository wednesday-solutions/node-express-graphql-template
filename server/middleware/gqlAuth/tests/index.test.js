import { invalidScope } from '@middleware/gqlAuth';

describe('gqlAuth tests', () => {
  let res;
  beforeEach(() => {
    res = {
      status: code => ({
        status: code,
        send: msg => msg
      })
    };
  });
  it('should set the status to 401 when invalidScope is called ', () => {
    const spy = jest.spyOn(res, 'status');
    const response = invalidScope(res);
    expect(spy).toBeCalledWith(401);
    expect(response.errors[0]).toBe(
      'Invalid scope to perform this operation. Contact support@wednesday.is for more information.'
    );
  });
  describe('handlePreflight middleware', () => {
    it('should be able to return status 200 when call OPTIONS request', async () => {
      const { handlePreflightRequest } = require('../index');
      const req = {
        method: 'OPTIONS'
      };
      const res = {
        header: jest.fn(() => {}),
        sendStatus: jest.fn(() => {})
      };
      await handlePreflightRequest(req, res, () => {});
      expect(res.header.mock.calls.length).toBe(1);
      expect(res.sendStatus.mock.calls.length).toBe(1);
    });

    it('should be able to call next handler if valid request', async () => {
      const { handlePreflightRequest } = require('../index');
      const req = {
        method: 'GET'
      };
      const res = {
        header: () => {},
        sendStatus: () => {}
      };
      const next = jest.fn(() => {});
      await handlePreflightRequest(req, res, next);
      expect(next.mock.calls.length).toBe(1);
    });
  });

  describe('corsOptionsDelegate options', () => {
    beforeEach(() => {
      process.env.ENVIRONMENT_NAME = 'dev';
      process.env.NODE_ENV = 'dev';
    });
    it('should be able to return origin:true when local or test env', async () => {
      const { corsOptionsDelegate } = require('../index');
      const req = {
        method: 'GET'
      };
      process.env.ENVIRONMENT_NAME = 'local';
      process.env.NODE_ENV = 'local';
      const callback = jest.fn(() => {});
      await corsOptionsDelegate(req, callback);
      expect(callback.mock.calls.length).toBe(1);
      expect(callback.mock.calls[0][1]).toEqual({ origin: true });
    });

    it('should be able to return origin:true when domain matches the req headers', async () => {
      const { corsOptionsDelegate } = require('../index');
      const req = {
        header: () => 'owner.wednesday.is',
        method: 'GET'
      };
      const callback = jest.fn(() => {});
      await corsOptionsDelegate(req, callback);
      expect(callback.mock.calls.length).toBe(1);
      expect(callback.mock.calls[0][1]).toEqual({ origin: true });
    });

    it('should be able to return origin:true when domain requesting from localhost', async () => {
      const { corsOptionsDelegate } = require('../index');
      const req = {
        header: () => 'localhost:3000',
        method: 'GET'
      };
      const callback = jest.fn(() => {});
      await corsOptionsDelegate(req, callback);
      expect(callback.mock.calls.length).toBe(1);
      expect(callback.mock.calls[0][1]).toEqual({ origin: true });
    });

    it('should be able to return origin:false when req headers is not any of allowed domain!', async () => {
      const { corsOptionsDelegate } = require('../index');

      const req = {
        header: () => 'www.ws.is',
        method: 'GET'
      };
      const callback = jest.fn(() => {});
      await corsOptionsDelegate(req, callback);
      expect(callback.mock.calls.length).toBe(1);
      expect(callback.mock.calls[0][1]).toEqual({ origin: false });
    });
  });
  describe('getQuery middleware Tests', () => {
    const request = {
      body: {
        query: `query Address{
          address(id:1){
            id
          }
        }`
      }
    };
    it('successfully get queryName', async () => {
      const { getQueryName } = require('../index');
      const response = await getQueryName(request);
      expect(response).toBeTruthy();
      expect(response.queryName).toEqual('address');
    });
  });
  describe('isPublicQuery tests', () => {
    it('should be able to find out if a query is public or not', async () => {
      const { isPublicQuery } = require('../index');
      let req = {
        body: {
          query: `query address{
            address(id:1){
              id
            }
          }
          `
        }
      };
      let response = await isPublicQuery(req);
      expect(response).toBe(false);

      req = {
        body: {
          query: `query PurchasedProduct{
            purchasedProduct(id:1){
              id
            }
          }
          `
        }
      };
      response = await isPublicQuery(req);
      expect(response).toBe(true);
    });
  });
  describe('isAuthenticated tests', () => {
    let mocks;
    beforeEach(() => {
      const spy = jest.fn();
      mocks = {
        next: spy
      };
      process.env.ENVIRONMENT_NAME = 'dev';
      process.env.NODE_ENV = 'dev';
    });
    const req = {
      body: {
        query: `query Address{
          address(id:1){
            id
          }
        }
        `
      },
      headers: {}
    };

    it('should call next if the environment is test or local ', async () => {
      process.env.ENVIRONMENT_NAME = 'local';
      const { isAuthenticated } = require('../index');
      await isAuthenticated(req, res, mocks.next);
      expect(mocks.next).toBeCalled();
    });
    it('should return an erorr if the access token is missing', async () => {
      const { isAuthenticated } = require('../index');
      const response = await isAuthenticated(req, res, mocks.next);
      expect(response.errors).toEqual('Access Token missing from header');
    });

    it('should return an error if the token is invalid', async () => {
      req.headers.authorization = 'bearer PLPL';
      const error = 'this is an error';
      jest.spyOn(require('jsonwebtoken'), 'verify').mockImplementation((_, b, cb) => {
        cb(new Error(error));
      });
      const { isAuthenticated } = require('../index');
      const response = await isAuthenticated(req, res, mocks.next);
      expect(response.errors).toEqual([error]);
    });

    it('should call the next middleware without any errors', async () => {
      req.headers.authorization = 'bearer PLPL';
      const jwtVerifySpy = jest.fn();
      jest.spyOn(require('jsonwebtoken'), 'verify').mockImplementation((_, b, cb) => {
        jwtVerifySpy();
        cb(null, { user: { id: 1 } });
      });
      const { isAuthenticated } = require('../index');
      await isAuthenticated(req, res, mocks.next);
      expect(mocks.next).toBeCalled();
      expect(jwtVerifySpy).toBeCalled();
    });

    it('should return an error if the user is unauthorized', async () => {
      req.headers.authorization = 'bearer PLPL';
      const jwtVerifySpy = jest.fn();
      jest.spyOn(require('jsonwebtoken'), 'verify').mockImplementation((_, b, cb) => {
        jwtVerifySpy();
        cb(null, { user: { id: 2 } });
      });
      const { isAuthenticated } = require('../index');
      const query = req.body.query;
      req.body.query = `query PurchasedProducts{
        purchasedProducts(limit:10, offset: 1){
              edges {
                node {
                  id
                }
              }
            }
          }
          `;
      const response = await isAuthenticated(req, res, mocks.next);
      console.log('this is the response', { response });
      expect(response.errors).toStrictEqual([
        'Invalid scope to perform this operation. Contact support@wednesday.is for more information.'
      ]);
      expect(jwtVerifySpy).toBeCalled();
      req.body.query = query;
    });
    it('should throw an erorr with Internal Server error in case of failure when unhandled error', async () => {
      const { isAuthenticated } = require('../index');
      jest.spyOn(require('@utils'), 'isLocalEnv').mockImplementationOnce(() => {
        throw new Error();
      });
      const response = await isAuthenticated(req, res, mocks.next);
      expect(response.errors).toStrictEqual(['Internal server error']);
    });
    it('should throw a custome error in case of unhandled error', async () => {
      const errMsg = 'this is some error';
      const { isAuthenticated } = require('../index');
      jest.spyOn(require('@utils'), 'isLocalEnv').mockImplementationOnce(() => {
        throw new Error(errMsg);
      });
      const response = await isAuthenticated(req, res, mocks.next);
      expect(response.errors).toStrictEqual([errMsg]);
    });
  });
});
