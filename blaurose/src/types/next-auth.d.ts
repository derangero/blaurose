import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  // クライアント側で使用するsession（useSessionから取得するオブジェクト）にプロパティを追加します。
  interface Session {
    user: {
      name:any;
      employeeCode :string;
      employeeName :string;
      shopCode :string;
      shopName :string;
      companyId :string;
    } & DefaultSession["user"];
  }
  interface User {
    name:any;
    employeeCode :string;
    employeeName :string;
    shopCode :string;
    shopName :string;
    companyId :string;
  }
}

declare module "next-auth/jwt" {
  // "jwt"コールバックのtokenパラメータに任意のプロパティを追加します。
  interface JWT {
    name:any;
    employeeCode :string;
    employeeName :string;
    shopCode :string;
    shopName :string;
    companyId :string;
  }
}