'use strict';
import mapKeysDeep from 'map-keys-deep';
import { snakeCase, camelCase } from 'lodash';
import { redisCache } from 'utils/cacheConstants';
require('@babel/register');

const Hapi = require('@hapi/hapi');
const path = require('path');
const wurst = require('wurst');

exports.init = async () => {
    const server = Hapi.server({
        port: 9000,
        host: 'localhost',
        cache: [redisCache]
    });
    await server.register({
        plugin: wurst,
        options: {
            routes: '**/routes.js',
            cwd: path.join(__dirname, 'routes'),
            log: true
        }
    });
    const onPreHandler = function(request, h) {
        const requestQueryParams = request.query;
        const requestPayload = request.payload;
        request.query = mapKeysDeep(requestQueryParams, keys =>
            camelCase(keys)
        );
        request.payload = mapKeysDeep(requestPayload, keys => camelCase(keys));
        return h.continue;
    };

    const onPreResponse = function(request, h) {
        const response = request.response;
        const responseSource = response.source;
        response.source = mapKeysDeep(responseSource, keys => snakeCase(keys));
        return h.continue;
    };

    server.ext('onPreHandler', onPreHandler);
    server.ext('onPreResponse', onPreResponse);
    return server;
};
