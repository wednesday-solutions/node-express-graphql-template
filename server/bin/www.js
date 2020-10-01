require('@babel/register');
require('@babel/polyfill');
import { app } from '../index';
import debugLib from 'debug';
import http from 'http';
const debug = debugLib('reporting-dashboard:server');
