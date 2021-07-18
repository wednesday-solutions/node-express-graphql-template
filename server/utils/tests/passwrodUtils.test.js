import { createPassword, checkPassword } from '../passwordUtils';
import md5 from 'md5';

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
