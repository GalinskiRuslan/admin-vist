// src/services/auth.service.ts
import { AxiosResponse } from "axios";
import $api from "../http";

/** ==== API response types (из спецификации) ==== */
export interface WebUserCheckResponse {
  elapsed_time: number;
  req_id: string;
  status: string; // "ok"
  userExists: boolean;
}

export interface WebUserAuthResponse {
  elapsed_time: number;
  req_id: string;
  status: string; // "ok"
  message: "success";
  internal_start_time_counter: number; // микросекунды
  token: string;
}

export interface WebUserVerifyResponse {
  elapsed_time: number;
  req_id: string;
  status: "ok";
  internal_start_time_counter: number; // микросекунды
}

/** ==== Локальное хранилище токена ==== */
const TOKEN_STORAGE_KEY = "webuser_token";
const COOKIE_NAME = "authToken";

function setCookieToken(token: string | null) {
  if (typeof document === "undefined") return;

  if (!token) {
    // удалить cookie
    document.cookie = `${COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
  } else {
    // поставим на сутки (можешь поменять Max-Age)
    document.cookie = `${COOKIE_NAME}=${token}; Path=/; Max-Age=86400; SameSite=Lax`;
  }
}

function setStoredToken(token: string | null) {
  if (!token) {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    return;
  }
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

/** ==== Сервис авторизации веб-пользователей ==== */
export default class AuthService {
  /** 1) Проверка существования пользователя */
  static async checkUser(
    login: string
  ): Promise<AxiosResponse<WebUserCheckResponse>> {
    return $api.get<WebUserCheckResponse>(`/vista/api/webuser/check`, {
      params: { email: login },
    });
  }

  /** 2) Аутентификация (Basic auth) -> получить token */
  static async authBasic(
    login: string,
    password: string
  ): Promise<AxiosResponse<WebUserAuthResponse>> {
    return $api.post<WebUserAuthResponse>("/vista/api/webuser/auth", null, {
      auth: {
        username: login,
        password,
      },
    });
  }

  /** 3) Верификация токена (из аргумента или из localStorage) */
  static async verify(
    token?: string
  ): Promise<AxiosResponse<WebUserVerifyResponse>> {
    const t = token;
    if (!t) {
      return Promise.reject(new Error("Token is not set"));
    }

    // 1) подстрахуемся, что заголовок token есть у инстанса по умолчанию
    $api.defaults.headers.common["token"] = t;

    // 2) отправляем без отдельных headers — axios сам подставит defaults
    return $api.post<WebUserVerifyResponse>("/vista/api/webuser/verify", null);
  }

  /** Установить токен в localStorage и в axios по умолчанию */
  static setToken(token: string) {
    setStoredToken(token);
    // По доке — кастомный заголовок 'token'. Если перейдёте на Bearer — поменять тут на Authorization.
    $api.defaults.headers.common["token"] = token;
    setCookieToken(token);
  }

  /** Очистить токен */
  static clearToken() {
    setStoredToken(null);
    setCookieToken(null);
    delete $api.defaults.headers.common["token"];
  }

  /** Удобный логин: basic -> сохранить токен -> вернуть ответ */
  static async login(login: string, password: string) {
    const res = await this.authBasic(login, password);
    this.setToken(res.data.token);
    return res;
  }

  /** Быстро проверить валидность текущего токена (true/false) */
  static async isTokenValid(t?: string): Promise<any> {
    try {
      const res = await this.verify(t);
      return res;
    } catch (e) {
      return e;
    }
  }
}
