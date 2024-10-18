export { default } from "next-auth/middleware";

export const config = {
  matcher: "/((?!auth|_next/static|_next/images|images|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|favicon.ico|manifest.json).*)",
};