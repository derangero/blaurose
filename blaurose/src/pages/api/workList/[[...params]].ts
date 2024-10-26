import { GetTimecardsFromParam, getWorkListPdf } from '@/services/workList/workListService';
import { NextApiRequest, NextApiResponse } from 'next';
import { createHandler, Get, Param, Req, Res } from 'next-api-decorators';

class WorkListController {
  @Get('/getTimecards')
  public async getTimecards(@Req() _req: NextApiRequest, @Res() res: NextApiResponse) {
    const timecards = await GetTimecardsFromParam(
      _req.query.fromYearMonthDay as string,
      _req.query.toYearMonthDay as string,
      _req.query.employeeId as string
    );

    return res.status(200).json({ param: timecards });
  }
}

export default createHandler(WorkListController);
