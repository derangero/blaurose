import jwt from "jsonwebtoken"
import { SelectByLoginId } from '@/repositories/user/dba_user'
const NEXT_PUBLIC_SECRET_KEY = "abcdefg"

export async function login(login_id :string, password: string) {
    try {
        const user = await SelectByLoginId(login_id)
        if (user) {
            if (password === user.password) {
                //jsonwebtokenでトークンを発行する
                const token = jwt.sign({
                    username: user.user_id,
                }, NEXT_PUBLIC_SECRET_KEY , { expiresIn: "2m" })
                const param = {
                    employee_name: user.employee.employee_name,
                    employee_code: user.employee.employee_code,
                    shop_code: user.employee.shop.shop_code,
                    shop_name: user.employee.shop.shop_name
                }
                return param;
            }
        }
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
    }
}

export default login	