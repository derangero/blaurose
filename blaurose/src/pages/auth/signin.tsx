import { GetServerSideProps } from "next";
import { getCsrfToken } from "next-auth/react";
import { useRouter } from "next/router";

type SignInProps = {
  csrfToken?: string;
};

export default function SignIn({ csrfToken }: SignInProps) {
  const router = useRouter();
  const { error } = router.query;

  return (
    <form method="post" action="/api/auth/callback/credentials">
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <label>
        ユーザーID
        <input name="login_id" type="text" />
      </label>
      <label>
        パスワード
        <input name="password" type="password" />
      </label>
      <button type="submit">サインイン</button>
      {error && <div>サインイン失敗</div>}
    </form>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
};