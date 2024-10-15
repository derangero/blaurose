export { default } from "next-auth/middleware";

export const config = {
  matcher: "/((?!auth|_next/static|_next/images|images|icons|png|favicon.ico|manifest.json).*)",
};