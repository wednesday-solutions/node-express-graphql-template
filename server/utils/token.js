import jwt from 'jsonwebtoken';
import { logger } from '@utils';

export class Token {
  static secret = process.env.ACCESS_TOKEN_SECRET;
  expiresIn = '1d';

  constructor({ user, overrideExpiration }) {
    if (overrideExpiration) {
      this.expiresIn = overrideExpiration;
    }
    if (!user) {
      logger().error('Token::constructor::user_not_found');
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
    logger().debug(`Token::get::${token}`);
    return token;
  }
}
