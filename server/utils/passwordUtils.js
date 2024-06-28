import crypto from 'crypto';

export const createPassword = password => {
  const salt = crypto.randomBytes(16).toString('hex'); // Generate a random salt
  const hashedPassword = crypto.scryptSync(password, salt, 64).toString('hex'); // Generate a hash
  return `${salt}:${hashedPassword}`;
};

export const checkPassword = (passwordToVerify, storedHash) => {
  const [salt, key] = storedHash.split(':');
  const derivedKey = crypto.scryptSync(passwordToVerify, salt, 64).toString('hex');
  return key === derivedKey;
};
