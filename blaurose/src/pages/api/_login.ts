import jwt from "jsonwebtoken"
const NEXT_PUBLIC_SECRET_KEY = "abcdefg"
import { SelectByLoginId } from '../../../prisma/user/dba_user'

const Login = async (
    req: { body: { login_id: any; password: any } },
    res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; token?: any; param?: any }): any; new(): any } } }) => {
        try {
	    //フロントエンド側からのデータを受け取る
        const { login_id, password } = req.body
	
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
                return res.status(200).json({ message: "ログイン成功", token: token, param: param })
            } else {
                return res.status(400).json({ message: "パスワードが間違っています" })
            }
        } else {
            return res.status(400).json({ message: "ユーザーが存在しない。登録してください" })
        }

    } catch (error) {
        console.error(`Error fetching data: ${error}`)
        return res.status(400).json({ message: "ログイン失敗"})
    }
}

export default Login	