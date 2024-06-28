import { createPassword, checkPassword } from '../passwordUtils';
import crypto from 'crypto';

describe('createPassword tests', () => {
  it('should ensure that it create correct password', () => {
    const password = '1234';
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto.scryptSync(password, salt, 64).toString('hex');
    expect(createPassword(password).length).toEqual(`${salt}:${hashedPassword}`.length);
  });
});

describe('check password tests', () => {
  const password = '1234';
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedPassword = `${salt}:${crypto.scryptSync(password, salt, 64).toString('hex')}`;

  it('should ensure it returns true when password is correct', async () => {
    expect(await checkPassword(password, hashedPassword)).toBeTruthy();
  });
  it('should ensure it returns false when password is incorrect', async () => {
    expect(await checkPassword('123', hashedPassword)).toBeFalsy();
    expect(await checkPassword('', hashedPassword)).toBeFalsy();
  });
});
