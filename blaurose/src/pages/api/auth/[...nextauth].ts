import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SelectSessionDataByLoginIdAndPassword } from '../../../repositories/user/dba_user'

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
        const user = await SelectSessionDataByLoginIdAndPassword(credentials.login_id, credentials.password)

        if (user) {
          // 返されたオブジェクトはすべて、JWT の「user」プロパティに保存されます。
          const result = {
            id: "",
            name: user,
            email: "",
            image: "",
            employeeCode: user.employee.employee_code,
            employeeName: user.employee.employee_name,
            shopCode: user.employee.shop.shop_code,
            shopName: user.employee.shop.shop_name,
            companyId: user.employee.shop.company_id,
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
      return process.env.NEXT_PUBLIC_SERVICE_URL_BASE + "main/main";
    },
  },
});