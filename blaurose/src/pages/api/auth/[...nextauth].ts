import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({log: ["query"]})

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      // `credentials`は、サインインページでフォームを生成するために使用されます。
      credentials: {
        login_id: { label: "ログインID", type: "text" },
        password: { label: "パスワード", type: "password" },
      },
      async authorize(credentials, req) {
        // `credentials`で定義した`login_id`、`password`が入っています。
        // ここにロジックを追加して、資格情報からユーザーを検索します。
        // 本来はバックエンドから認証情報を取得するイメージですが、ここでは定数を返しています。
        // const user = await authenticationLogic(credentials?.login_id, credentials?.password);
        if (credentials == null || credentials.login_id == null || credentials.password == '') {
          return null; //ユーザーが存在しません
        }
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
          where: { login_id: credentials?.login_id, password: credentials?.password }
      })
      // const user = {
      //   name: "J Smith",
      //   email: "jsmith@example.com",
      //   image: "",
      //   id: "1",
      //   role: "admin",
      //   backendToken: "backEndAccessToken",
      // };
        if (result) {
          // 返されたオブジェクトはすべて、JWT の「user」プロパティに保存されます。
          const user = {
            id: "",
            name: {result},
            email: "",
            image: "",
            employeeCode: result.employee.employee_code,
            employeeName: result.employee.employee_name,
            shopCode: result.employee.shop.shop_code,
            shopName: result.employee.shop.shop_name,
            companyId: result.employee.shop.company_id,
          };
          return user;
        } else {
          // 認証失敗の場合はnullを返却します。
          return null;
        }
      },
    }),
  ],
  pages: {
    // カスタムログインページを追加します。
    signIn: "/auth/login",
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
      session.user.employeeCode = token.employeeCode;
      session.user.employeeName = token.employeeName;
      session.user.shopCode = token.shopCode;
      session.user.shopName = token.shopName;
      session.user.companyId = token.companyId;
      return session;
    },
    // ログイン後にリダイレクトするURLを返す
    async redirect({ url, baseUrl }) {
      return "http://localhost:3000/main/main";
    },
  },
});