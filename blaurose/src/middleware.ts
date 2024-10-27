export { default } from "next-auth/middleware";

export const config = {
  matcher: "/((?!login|_next/static|_next/images|images|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css)$|favicon.ico|manifest.json).*)",
};