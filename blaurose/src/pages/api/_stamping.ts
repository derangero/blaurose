import React, { useEffect } from 'react'
import jwt from "jsonwebtoken"
import { PrismaClient } from '@prisma/client'
import { getServerSession, NextAuthOptions } from 'next-auth'
const NEXT_PUBLIC_SECRET_KEY = "abcdefg"
const prisma = new PrismaClient({log: ["query"]})
import authOptions from "../api/auth/[...nextauth]"
import { redirect, Router } from 'react-router-dom'
import {useRouter} from 'next/router';
import { DateTime,Settings } from "luxon";
import { GetTimecard, GetTimecardByPrevious } from '../../../prisma/timecard/dba_timecard'


export const config = {
    providers: authOptions.providers, // rest of your config
} satisfies NextAuthOptions
  
export const Stamping = async (
    req: { body: { login_id: any; password: any } },
    res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; token?: any; param?: any }): any; new(): any } } }) => {
        try {
	    //フロントエンド側からのデータを受け取る
        const { login_id, password } = req.body
        const session = await getServerSession(req, res, config)
        Settings.defaultLocale = 'ja';
        const nowDate = DateTime.local();
        const nowDateTime = DateTime.local();
        const employeeId = session?.user.name.result.employee.employee_id;
        let stampedByPreviousMark = false;
        let timecard = await GetTimecardByPrevious(prisma, nowDate.minus({days: 1}).toFormat('yyyyMMdd'), employeeId);
        if (timecard) {
            timecard = await prisma.timecard.update({
                where: {
                    u_timecard_stamped_on_employee_id: {
                        stamped_on: parseInt(nowDate.minus({days: 1}).toFormat('yyyyMMdd')),
                        employee_id: employeeId
                    }
                },
                data: {
                  stampedTo_at: nowDateTime.toISO(),
                },
              }) 
            stampedByPreviousMark = true;
        } else {
          timecard = await GetTimecard(prisma, nowDate.toFormat('yyyyMMdd'), employeeId);
          timecard = await prisma.timecard.upsert({
            where: {
                u_timecard_stamped_on_employee_id: {
                    stamped_on: parseInt(nowDate.toFormat('yyyyMMdd')),
                    employee_id: employeeId
                }
            },
            update: {
              stampedTo_at: nowDateTime.toISO(),
            },
            create: {
                stamped_on: parseInt(nowDate.toFormat('yyyyMMdd')),
                stampedFrom_at: nowDateTime.toISO(),
                employee_id: employeeId,
            },
          }) 
        }
        return res.status(200).json({
        message: "打刻しました",
        param: {
                stampedFromAt: timecard && timecard.stampedFrom_at
                    ? DateTime.fromJSDate(timecard?.stampedFrom_at).toFormat('HH:mm') : "",
                stampedToAt: timecard && timecard.stampedTo_at
                    ? DateTime.fromJSDate(timecard?.stampedTo_at).toFormat('HH:mm') : "",
                stampedByPreviousMark: stampedByPreviousMark
            }
        });
    } catch (error) {
        console.error(`Error fetching data: ${error}`)
        return res.status(400).json({ message: "打刻エラーです。管理者にお問い合わせください。"})
    }
}

export default Stamping	