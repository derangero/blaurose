import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      // `credentials`は、サインインページでフォームを生成するために使用されます。
      credentials: {
        username: { label: "ユーザ名", type: "text" },
        password: { label: "パスワード", type: "password" },
      },
      async authorize(credentials, req) {
        // `credentials`で定義した`username`、`password`が入っています。
        // ここにロジックを追加して、資格情報からユーザーを検索します。
        // 本来はバックエンドから認証情報を取得するイメージですが、ここでは定数を返しています。
        // const user = await authenticationLogic(credentials?.username, credentials?.password);
        const user = {
          id: "1",
          name: "J Smith",
          email: "jsmith@example.com",
          role: "admin",
          backendToken: "backEndAccessToken",
        };

        if (user) {
          // 返されたオブジェクトはすべて、JWT の「user」プロパティに保存されます。
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
    signIn: "/auth/signin",
  },
  callbacks: {
    // `jwt()`コールバックは`authorize()`の後に実行されます。
    // `user`に追加したプロパティ`role`と`backendToken`を`token`に設定します。
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.backendToken = user.backendToken;
      }
      return token;
    },
    // `session()`コールバックは`jwt()`の後に実行されます。
    // `token`に追加したプロパティ`role`と`backendToken`を`session`に設定します。
    session({ session, token }) {
      session.user.role = token.role;
      session.user.backendToken = token.backendToken;
      return session;
    },
  },
});