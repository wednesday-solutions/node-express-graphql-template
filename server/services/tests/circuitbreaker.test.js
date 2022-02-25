import { newCircuitBreaker } from '../circuitbreaker';

describe('newCircuitBreaker', () => {
  const fallbackMessage = 'Some fallback message';
  it('should return the response from the API', async () => {
    const data = 'this is some API response';
    const somefunc = async () => ({
      data
    });
    const testme = 'testme';
    const breaker = newCircuitBreaker(somefunc, fallbackMessage);
    const res = await breaker.fire(testme);
    expect(res.data).toBe(data);
  });
  it('should return the fallback message if the API throws an error', async () => {
    const customError = 'This is some error';

    const somefunc = async () => {
      throw new Error(customError);
    };
    const testme = 'testme';
    const breaker = newCircuitBreaker(somefunc, fallbackMessage);
    const res = await breaker.fire(testme);
    expect(res).toBe(`${fallbackMessage}. ${customError}`);
  });
  it('should return the fallback message if the API throws an error without a message.', async () => {
    const somefunc = async () => {
      throw new Error();
    };
    const testme = 'testme';
    const breaker = newCircuitBreaker(somefunc, fallbackMessage);
    const res = await breaker.fire(testme);
    expect(res).toBe(`${fallbackMessage}. Error`);
  });
});
