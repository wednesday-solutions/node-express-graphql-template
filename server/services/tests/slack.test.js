import { sendMessage, getSlackInstance } from '../slack';
import * as utils from '@utils';

describe('Slack tests', () => {
  const message = 'Some generic message';
  describe('slack send tests', () => {
    it('should send the message', async () => {
      jest.spyOn(getSlackInstance(), 'send').mockImplementation(
        msg =>
          new Promise((resolve, reject) => {
            resolve(msg);
          })
      );

      const res = await sendMessage(message);
      // eslint-disable-next-line
      expect(res.text).toEqual(`{\"error\":\"${message}\",\"env\":\"test\"}`);
    });
  });
  describe('slack error tests', () => {
    it('should send the error', async () => {
      const error = new Error();
      jest.spyOn(utils, 'logger').mockImplementation(() => {
        const obj = {
          error: err => err
        };
        return obj;
      });
      jest.spyOn(getSlackInstance(), 'send').mockImplementation(
        msg =>
          new Promise((resolve, reject) => {
            reject(error);
          })
      );
      const res = await sendMessage(message);
      expect(res).toBe(`Slack error: ${error}. Please check webhook url`);
    });
  });
});
