"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "../update-admin.module.css";
import AuthService from "../services/authService";

type AdminLayoutProps = {
  children: React.ReactNode;
};

const NAVIGATION = [
  { href: "/", label: "Домашняя страница" },
  { href: "/add", label: "Добавление версии" },
];

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const pathname = usePathname();

  const router = useRouter();

  const handleLogout = () => {
    AuthService.clearToken();
    router.replace("/login");
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.branding}>
            <Image
              src="/logo_.gif"
              alt="Логотип системы администрирования"
              width={48}
              height={48}
              className={styles.logo}
            />
            <div>
              <h1>Администратор обновлений клиентского ПО</h1>
              <p>Управление версиями, пакетами и безопасностью обновлений</p>
            </div>
          </div>
          <nav className={styles.navigation} aria-label="Главная навигация">
            <ul className={styles.navigationList}>
              {/* {NAVIGATION.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={
                        isActive ? styles.activeNavLink : styles.navLink
                      }
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })} */}
            </ul>
            <button onClick={handleLogout}>Выйти</button>
          </nav>
        </div>
      </header>
      <main className={styles.content}>{children}</main>
    </div>
  );
};
