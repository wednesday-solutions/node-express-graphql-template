let token = 'token';

function __setupMocks(t) {
  token = t;
}

class Token {
  get() {
    return token;
  }
}
module.exports = {
  Token,
  __setupMocks
};
