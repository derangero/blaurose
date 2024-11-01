import { isNullOrEmpty } from '@/utils/common/commonUtil';
import login from '@/services/login/toRef_loginService';
import { NextApiRequest, NextApiResponse } from 'next';
import { createHandler, Get, Param, Post, Req, Res } from 'next-api-decorators';

class LoginController {
  @Post('/')
  public async stamp(@Req() _req: NextApiRequest, @Res() res: NextApiResponse) {
    const login_id = _req.query.login_id as string;
    const password =_req.query.password as string;
    if (isNullOrEmpty(login_id) || isNullOrEmpty(password)) {
        return null;
    }

    const result = await login(login_id, password)

    return result;
  }
}

export default createHandler(LoginController);
