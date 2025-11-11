"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../update-admin.module.css";

type AdminLayoutProps = {
  children: React.ReactNode;
};

const NAVIGATION = [
  { href: "/", label: "Домашняя страница" },
  { href: "/add", label: "Добавление версии" },
];

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const pathname = usePathname();

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div>
          <h1>Администратор обновлений клиентского ПО</h1>
          <p>Управление версиями, пакетами и безопасностью обновлений</p>
        </div>
        <nav className={styles.navigation}>
          {NAVIGATION.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? styles.activeNavButton : ""}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className={styles.content}>{children}</main>
    </div>
  );
};
