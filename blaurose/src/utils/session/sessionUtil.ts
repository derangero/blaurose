import { SessionData } from "@/types";
import { GetServerSession } from "@/lib/auth/authCredentialsProvider";

export async function getServerSessionData(context:any) : Promise<SessionData> {
  const session = await GetServerSession(context.req, context.res)  
    const companyId = session?.user.name.employee.shop.company_id;
    const shopCode = session?.user.name.employee.shop.shop_code;
    const shopName = session?.user.name.employee.shop.shop_name;
    const employeeName = session?.user.name.employee.employee_name;
    const employeeId = session?.user.name.employee.employee_id;

    return {
      companyId: companyId,
      shopCode: shopCode,
      shopName: shopName,
      employeeName: employeeName,
      employeeId: employeeId,
    }
}