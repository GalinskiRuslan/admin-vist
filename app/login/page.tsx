"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthService from "../services/authService";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await AuthService.login(login, password);
      router.replace(redirect); // попадём туда, куда хотел изначально
    } catch (err) {
      console.error(err);
      setError("Неверный логин или пароль");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 border rounded-md shadow-sm space-y-4"
      >
        <h1 className="text-xl font-semibold">Вход</h1>

        <div>
          <label className="block text-sm mb-1">Логин</label>
          <input
            className="border rounded w-full px-3 py-2 text-sm"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Пароль</label>
          <input
            type="password"
            className="border rounded w-full px-3 py-2 text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded py-2 text-sm"
          disabled={loading}
        >
          {loading ? "Входим..." : "Войти"}
        </button>
      </form>
    </main>
  );
}
