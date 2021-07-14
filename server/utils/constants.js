import jwt from 'jsonwebtoken';

export const TIMESTAMP = 'YYYY-MM-DD HH:mm:ss';

export class Token {
  static secret = process.env.ACCESS_TOKEN_SECRET;
  expiresIn = '1d';

  constructor({ user, overrideExpiration }) {
    if (overrideExpiration) {
      this.expiresIn = overrideExpiration;
    }
    if (!user) {
      console.error('Token::constructor::user_not_found');
      return;
    }
    this.user = user;
  }

  get() {
    const token = jwt.sign(
      {
        userId: this.user.id
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: this.expiresIn
      }
    );
    console.debug(`Token::get::${token}`);
    return token;
  }
}
