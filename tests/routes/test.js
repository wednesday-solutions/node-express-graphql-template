/* global server */
import { mockDB } from 'utils/testUtils';

describe('as', () => {
    beforeAll(() => {
        mockDB();
    });

    it('should return 200', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/'
        });
        expect(res.statusCode).toEqual(200);
    });
});
