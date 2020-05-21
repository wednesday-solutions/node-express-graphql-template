/* global server */
import { init } from './lib/testServer';
import { mockDB } from 'utils/testUtils';
import { ONE_USER_DATA } from 'utils/constants';

mockDB();

beforeEach(async () => {
    global.server = await init();
    jest.resetModules();
});

beforeAll(() => {
    jest.doMock('root/server', () => ({
        server: {
            ...server,
            methods: {
                findOneUser: id => {
                    if (id === '1') {
                        return new Promise(resolve => resolve(ONE_USER_DATA));
                    } else {
                        return new Promise(resolve => resolve(null));
                    }
                }
            }
        }
    }));
});

afterAll(async () => {
    await server.stop();
});
