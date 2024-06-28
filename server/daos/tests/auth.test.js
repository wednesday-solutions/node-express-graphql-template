import { getUserByEmailPassword, createUserBySignup } from '../auth';
import db from '@database/models';
import { checkPassword, createPassword } from '@server/utils/passwordUtils';

describe('getUserBySign tests', () => {
  const email = 'rohansaroha2@wednesday.is';
  const password = '1234';
  const hashedPassword = createPassword(password);
  const user = { email, password: hashedPassword };
  let mock;

  beforeEach(() => {
    mock = jest.spyOn(db.users, 'findOne');
    mock.mockReturnValue(user);
  });

  it('should ensure that it return user when password is correct', async () => {
    const res = await getUserByEmailPassword(email, password);
    expect(res).toEqual(user);
  });
});

describe('creatUserBySignup tests', () => {
  it('should ensure it calls correct params to db', async () => {
    const firstName = 'abc';
    const lastName = 'x';
    const email = 'abc@wednesday.is';
    const password = '1234';
    const mock = jest.spyOn(db.users, 'create');
    await createUserBySignup(firstName, lastName, email, password);
    expect(mock).toHaveBeenCalledWith({ firstName, lastName, email, password: expect.any(String) });
    expect(mock.mock.calls[0][0].password.length).toEqual(161);
    const hashedPassword = mock.mock.calls[0][0].password;
    expect(checkPassword(password, hashedPassword));
  });
});
