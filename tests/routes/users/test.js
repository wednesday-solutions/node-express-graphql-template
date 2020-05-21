/* global server */

describe('as', () => {
    it('should return 200', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/users/1'
        });
        expect(res.statusCode).toEqual(200);
    });

    it('should return 404', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/users/2'
        });
        expect(res.statusCode).toEqual(404);
        expect(res.result.message).toEqual('No user was found for id 2');
    });
});
