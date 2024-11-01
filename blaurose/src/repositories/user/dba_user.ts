import { User } from '@/types';
import { prisma } from '@/lib/prisma/Prisma';

export async function SelectByLoginId(loginId: string) : User {
  const result = await prisma.user.findFirst({
    select: {
        password: true,
        user_id: true,
        employee: {
            select: {
                employee_code: true,
                employee_name: true,
                shop: {
                    select: {
                        shop_code:true,
                        shop_name:true
                    }
                }
            }
        }
    },
    where: { login_id: loginId }
  })
  return result;
}

export async function SelectSessionDataByLoginIdAndPassword(loginId: string, password: string) : User {
    const result = await prisma.user.findFirst({
        select: {
            password: true,
            user_id: true,
            employee: {
                select: {
                    employee_id: true,
                    employee_code: true,
                    employee_name: true,
                    shop: {
                        select: {
                            shop_id:true,
                            shop_code:true,
                            shop_name:true,
                            company_id:true
                        }
                    }
                }
            }
        },
        where: { login_id: loginId, password: password }
    })
  return result;
}
