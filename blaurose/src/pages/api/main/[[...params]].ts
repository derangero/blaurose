import { GetServerSession } from '@/lib/auth/authCredentialsProvider';
import { endRest, endWork, startRest, startWork } from '@/services/main/mainService';
import { NextApiRequest, NextApiResponse } from 'next';
import { createHandler, Get, Param, Post, Req, Res } from 'next-api-decorators';

class MainController {
  @Post('/startWork')
  public async startWork(@Req() _req: NextApiRequest, @Res() res: NextApiResponse) : Promise<string | null>  {

    const session = await GetServerSession(_req, res)
    const errorMsg = await startWork(session)

    return errorMsg;
  }

  @Post('/endWork')
  public async endWork(@Req() _req: NextApiRequest, @Res() res: NextApiResponse) : Promise<string | null> {

    const session = await GetServerSession(_req, res)
    const errorMsg = await endWork(session)

    return errorMsg;
  }

  @Post('/startRest')
  public async startRest(@Req() _req: NextApiRequest, @Res() res: NextApiResponse) {

    const session = await GetServerSession(_req, res)
    const result = await startRest(session)

    return result;
  }

  @Post('/endRest')
  public async endRest(@Req() _req: NextApiRequest, @Res() res: NextApiResponse) {

    const session = await GetServerSession(_req, res)
    const result = await endRest(session)

    return result;
  }
}

export default createHandler(MainController);
