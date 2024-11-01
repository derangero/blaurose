import { SelectSessionDataByLoginIdAndPassword } from "@/repositories/user/dba_user";
import { isNullOrEmpty } from "@/utils/common/commonUtil";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import type { NextAuthOptions, User } from "next-auth"
import NextAuth, { getServerSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

export const authCredentialsProvider = {
  providers: [
    CredentialsProvider({
        name: "Credentials",
        // `credentials`は、サインインページでフォームを生成するために使用されます。
        credentials: {
            loginId: { label: "ログインID", type: "text" },
            password: { label: "パスワード", type: "password" },
        },
        async authorize(credentials, req) {
            // `credentials`で定義した`login_id`、`password`が入っています。
            if (credentials == null || isNullOrEmpty(credentials.loginId) || isNullOrEmpty(credentials.password)) {
            return {id: "" } as User;
            }
            const user = await SelectSessionDataByLoginIdAndPassword(credentials.loginId, credentials.password)
            if (user) {
            // 返されたオブジェクトはすべて、JWT の「user」プロパティに保存されます。
            const result = {
                id: "success",
                name: user,
                email: "",
                image: "",
                companyId: user.employee.shop.company_id,
                shopCode: user.employee.shop.shop_code,
                shopName: user.employee.shop.shop_name,
                employeeCode: user.employee.employee_code,
                employeeName: user.employee.employee_name,
                employeeId: user.employee.employee_id,
            };

            return result;
            } else {
            // 認証失敗の場合はnullを返却します。
            return null;
            }
        },
    }),
  ],
  pages: {
    // カスタムログインページを追加します。
    signIn: "/login/login",
  },
  callbacks: {
    // `jwt()`コールバックは`authorize()`の後に実行されます。
    // `user`に追加したプロパティ`role`と`backendToken`を`token`に設定します。
    jwt({ token, user }) {
      if (user) {
        token.employeeCode = user.employeeCode;
        token.employeeName = user.employeeName;
        token.shopCode = user.shopCode;
        token.shopName = user.shopName;
        token.companyId = user.companyId;
      }
      return token;
    },
    // `session()`コールバックは`jwt()`の後に実行されます。
    // `token`に追加したプロパティ`role`と`backendToken`を`session`に設定します。
    session({ session, token }) {
      session.user.companyId = token.companyId;
      session.user.shopCode = token.shopCode;
      session.user.shopName = token.shopName;
      session.user.employeeCode = token.employeeCode;
      session.user.employeeName = token.employeeName;

      return session;
    },
    // ログイン後にリダイレクトするURLを返す
    async redirect({ url, baseUrl }) {
      return process.env.NEXT_PUBLIC_SERVICE_URL_BASE + "main/main";
    },
    async signIn({ user, account, profile, email, credentials }) {
      if(user?.id === '') {
        throw new Error('login error')
        return false;
      }
      return true
    }
  },
} satisfies NextAuthOptions

export const { handlers, auth, signIn, signOut } = NextAuth(authCredentialsProvider)

export function GetServerSession(...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []) {
  return getServerSession(...args, authCredentialsProvider)
}
