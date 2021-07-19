import { handleSignUp, handleSignIn } from '../index';
import * as AuthDoas from '@daos/auth';

describe('handleSignUp tests', () => {
  const email = 'rohansaroha2@wednesday.is';
  const password = 1234;
  const user = { email: email, password: password };

  it('should ensure that it signup the user', async () => {
    const mockResponse = () => {
      const res = {};
      res.json = jest.fn().mockReturnValue(res);
      res.sendStatus = jest.fn().mockReturnValue(res);
      res.data = { id: 1 };
      return res;
    };
    const res = mockResponse();
    const spy = jest.spyOn(AuthDoas, 'createUserBySignup').mockReturnThis(user);
    await handleSignUp(user, res);
    expect(spy).toBeCalled();
  });

  it('should ensure that it signin the user', async () => {
    const mockResponse = () => {
      const res = {};
      res.json = jest.fn().mockReturnValue(res);
      res.sendStatus = jest.fn().mockReturnValue(res);
      res.data = { id: 1 };
      return res;
    };
    const res = mockResponse();
    const spy = jest.spyOn(AuthDoas, 'getUserBySignIn').mockImplementation(() => user);
    await handleSignIn(user, res);
    expect(spy).toBeCalled();
  });
});
