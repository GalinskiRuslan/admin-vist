// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import AuthService from "./app/services/authService";

const PUBLIC_PATHS = ["/login", "/_next", "/favicon.ico"];
const VERIFY_URL = "https://vista-new-test2.gamma.kz/vista/api/webuser/verify";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Разрешаем статические штуки /login и т.п.
  const isPublic = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  const token = req.cookies.get("authToken")?.value;

  // Если страница публичная
  if (isPublic) {
    // если уже есть токен и юзер на /login → отправим на главную
    if (token && pathname === "/login") {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Все остальные маршруты требуют авторизации
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    // запоминаем, куда шёл пользователь, чтобы потом вернуть
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

// На какие пути вешать middleware
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)", // всё, кроме статики
  ],
};
