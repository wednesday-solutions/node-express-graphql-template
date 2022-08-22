import { getResponse } from '@server/utils/testUtils';

describe('handleSignUp tests', () => {
  const token = 'token';
  const user = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@doe.com',
    password: '12345',
    createdAt: '2022-08-22T06:18:41.941Z',
    updatedAt: '2022-08-22T06:18:41.932Z'
  };

  describe('signup tests', () => {
    it('should ensure that the user is able to signup if the database case succeeds', async () => {
      const authDaos = require('@daos/auth');
      jest.spyOn(authDaos, 'createUserBySignup').mockImplementation(() => ({ dataValues: user }));

      const mutation = `mutation SignUp {
                          signUp(firstName: "${user.firstName}",
                          lastName: "${user.lastName}", 
                          email: "${user.email}", 
                          password: "${user.password}") {
                            id
                            email
                            firstName
                            lastName
                            token
                            createdAt
                            updatedAt
                          }
                        }`;

      const res = await getResponse(mutation);
      const u = { ...user, id: `${user.id}` };
      delete u.password;
      expect(res.body.data.signUp).toStrictEqual({ ...u, token });
    });
    it('should ensure that the user is unable to signup if the database entry fails', async () => {
      const error = 'User already exists';
      const authDaos = require('@daos/auth');
      jest.spyOn(authDaos, 'createUserBySignup').mockRejectedValue(new Error(error));

      const mutation = `mutation SignUp {
                          signUp(firstName: "${user.firstName}",
                          lastName: "${user.lastName}", 
                          email: "${user.email}", 
                          password: "${user.password}") {
                            id
                            email
                            firstName
                            lastName
                            token
                            createdAt
                            updatedAt
                          }
                        }`;

      const res = await getResponse(mutation);
      expect(res.body.errors).toStrictEqual([error]);
    });
  });

  describe('signin tests', () => {
    it('should ensure that the user with the right credentials is given a token', async () => {
      const authDaos = require('@daos/auth');
      jest.spyOn(authDaos, 'getUserByEmailPassword').mockImplementation(() => user);
      const mutation = `mutation SignIn {
                              signIn(email: "${user.email}", password: "${user.password}") {
                                token
                              }
                            }`;
      const res = await getResponse(mutation);
      expect(res.body.data.signIn.token).toStrictEqual(token);
    });
    it('should ensure that the user without the right credentials is not given a token', async () => {
      const error = 'User does not exist';
      const authDaos = require('@daos/auth');
      jest.spyOn(authDaos, 'getUserByEmailPassword').mockRejectedValue(new Error(error));
      const mutation = `mutation SignIn {
                              signIn(email: "${user.email}", password: "${user.password}") {
                                token
                              }
                            }`;
      const res = await getResponse(mutation);
      expect(res.body.errors).toStrictEqual([error]);
    });
  });
});
