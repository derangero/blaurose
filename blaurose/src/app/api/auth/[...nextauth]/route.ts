import { authCredentialsProvider } from "@/lib/auth/authCredentialsProvider"
import NextAuth from "next-auth";

const handler = NextAuth(authCredentialsProvider);

export { handler as GET, handler as POST };