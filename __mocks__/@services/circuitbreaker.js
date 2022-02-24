let fire;

function __setupMocks(f) {
  fire = f;
}

function newCircuitBreaker() {
  return { fire: () => fire() };
}
module.exports = {
  __setupMocks,
  newCircuitBreaker,
  fire
};
