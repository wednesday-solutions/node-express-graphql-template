import authenticateToken from '../index';
import { getResponse, resetAndMockDB } from '@utils/testUtils';

describe('authentication tests',()=>{
    let req = {
        headers:{
            authorization:null
        }
    };
    const next = jest.fn();
    const OLD_ENV = process.env;
    const keys = {
        ACCESS_TOKEN_SECRET:
            '4cd7234152590dcfe77e1b6fc52e84f4d30c06fddadd0dd2fb42cbc51fa14b1bb195bbe9d72c9599ba0c6b556f9bd1607a8478be87e5a91b697c74032e0ae7af'
    };

    beforeEach(() => {
        process.env = { ...OLD_ENV, ...keys };
    });
    afterAll(() => {
        process.env = OLD_ENV;
    });

    it('should ensure it return 401 when no token is available',async()=>{
        const mockResponse = () => {
            const res = {};
            res.sendStatus = jest.fn().mockReturnValue(res);
            return res;
        };
        const res = mockResponse()
        authenticateToken(req,res,next);
        expect(res.sendStatus).toBeCalledWith(401);
    });
    
    it('should ensure it returns 403 when it doesnt verify',()=>{
        const mockResponse = () => {
            const res = {};
            res.sendStatus = jest.fn().mockReturnValue(res);
            return res;
        };
        const res = mockResponse();
        let req = {
            headers:{
                authorization:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjExLCJpYXQiOjE2MjYzODE3MzAsImV4cCI6MTYyNjQ2ODEzMH0.Sul9Q7zYaYtq5TsUp9S2a_1dw8MjkTFE7lViV8YuTA'
            }
        };
        authenticateToken(req,res,next);
        expect(res.sendStatus).toBeCalledWith(401);
    })
})