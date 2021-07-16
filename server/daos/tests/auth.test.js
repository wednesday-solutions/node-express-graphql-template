import md5 from 'md5';
import { createPassword, checkPassword, getUserBySignIn, createUserBySignup } from '../auth';
import db from '@database/models';

describe('createPassword tests', () => {
  it('should ensure that it create correct password', () => {
    const password = 1234;
    const md5Password = md5(password);
    expect(createPassword(password)).toEqual(md5Password);
  });
});

describe('check password tests', () => {
  const password = 1234;
  const md5Password = md5(1234);

  it('should ensure it returns true when password is correct', () => {
    expect(checkPassword(password, md5Password)).toBeTruthy();
  });
  it('should ensure it returns false when password is incorrect', () => {
    expect(checkPassword(123, md5Password)).toBeFalsy();
    expect(checkPassword('123', md5Password)).toBeFalsy();
    expect(checkPassword('', md5Password)).toBeFalsy();
  });
});

describe('getUserBySign tests', () => {
  const email = 'rohansaroha2@wednesday.is';
  const password = 1234;
  const md5Password = md5(password);
  const user = { email: email, password: md5Password };
  let mock;

  beforeEach(() => {
    mock = jest.spyOn(db.users, 'findOne');
    mock.mockReturnValue(user);
  });

  it('should ensure that it return user when password is correct', async () => {
    const res = await getUserBySignIn(email, password);
    expect(res).toEqual(user);
  });
});

describe('creatUserBySignup tests', () => {
  it('should ensure it calls correct params to db', async () => {
    const firstName = 'abc';
    const lastName = 'x';
    const email = 'abc@wednesday.is';
    const password = 1234;
    const mock = jest.spyOn(db.users, 'create');
    await createUserBySignup(firstName, lastName, email, password);
    expect(mock).toHaveBeenCalledWith({ firstName, lastName, email, password: md5(password) });
  });
});
