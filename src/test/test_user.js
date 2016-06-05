'use strict';

/**
* practice Node.js project
*
* @author William Wang <wangmuming_0218@126.com>
*/


import {expect} from 'chai';
import {request} from '../test';

describe('user', function(){

  it('signup', async function(){

    try{
      const ret = await request.post('/api/signup',{
        name: 'test1',
        password: '123456789'
      });
      // console.log(ret);
      throw new Error('should throws email: missing parameter "email"')
    }catch(err){
      console.log(err);
      expect(err.message).to.equal('email: missing parameter "email"');
    }

    {
      const ret = await request.post('/api/signup',{
        name: 'test1',
        password: '123456789',
        email:'text1@example.com'
      });
      console.log(ret);
      expect(ret.user.name).to.equal('test1');
      expect(ret.user.email).to.equal('text1@example.com');
    }

    {
      const ret = await request.post('/api/login',{
        name: 'test1',
        password: '123456789',
      });
      console.log(ret);
      expect(ret.token).to.be.a('string');
    }

  });

});
