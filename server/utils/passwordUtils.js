import md5 from 'md5';

export const createPassword = password => md5(password);

export const checkPassword = (password, hash) => md5(password) === hash;
