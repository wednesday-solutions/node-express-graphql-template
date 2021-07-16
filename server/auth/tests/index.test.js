import { getResponse, resetAndMockDB } from '@utils/testUtils';
import {handleSignUp} from '../index';
import * as AuthDoas from '../../daos/auth';

describe('handleSignUp tests',()=>{
    const email = 'rohansaroha2@wednesday.is';
    const password = 1234;
    const user = {email:email,password:password};
    let signUpSpy;

    it('should ensure that it signup the user',async()=>{
        const mockResponse = () => {
            const res = {};
            res.json = jest.fn().mockReturnValue(res);
            res.sendStatus = jest.fn().mockReturnValue(res);
            return res;
        };
        const res = mockResponse();
        console.log(AuthDoas);
        const newUser = jest.spyOn(AuthDoas, 'createUserBySignup')
            .mockImplementation(async () => user);

        await handleSignUp(req,res);

        expect(res.json).toBeCalledWith(newUser);

    })
})