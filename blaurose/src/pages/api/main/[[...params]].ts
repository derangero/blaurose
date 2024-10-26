import { upsertTimecard } from '@/services/main/mainService';
import { NextApiRequest, NextApiResponse } from 'next';
import { createHandler, Get, Param, Post, Req, Res } from 'next-api-decorators';
import { getServerSession } from 'next-auth';

class MainController {
  @Post('/stamp')
  public async stamp(@Req() _req: NextApiRequest, @Res() res: NextApiResponse) {

    const session = await getServerSession(_req, res)
    const result = await upsertTimecard(session)

    return result;
  }
}

export default createHandler(MainController);
