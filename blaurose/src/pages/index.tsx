import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <main>
      <div>{status}</div>
      <div>{session?.user?.name}</div>
      <div>{session?.user?.email}</div>
      <div>{session?.user?.shopCode}</div>
      <div>{session?.user?.shopName}</div>
      <button onClick={() => signOut()}>サインアウト</button>
    </main>
  );
}