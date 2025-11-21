// app/ClientAuthGuard.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AuthService, { getStoredToken } from "./services/authService";
import src from "../public/loading.gif";
import Image from "next/image";

const PUBLIC_PATHS = ["/login"];

export default function ClientAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (PUBLIC_PATHS.includes(pathname)) {
        setChecking(false);
        return;
      }

      const token = getStoredToken();
      if (!token) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      const ok = await AuthService.isTokenValid(token);

      if (!ok) {
        AuthService.clearToken();
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      setChecking(false);
    };

    run();
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Image src={src} alt="loding..." />
      </div>
    );
  }

  return <>{children}</>;
}
