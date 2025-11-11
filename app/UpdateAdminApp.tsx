"use client";

import { useMemo, useState } from "react";
import styles from "./update-admin.module.css";
import {
  Architecture,
  ClientSoftwareType,
  DEFAULT_FILTERS,
  FiltersState,
  PackageType,
  UpdateStatus,
  UpdateVersion,
} from "./types";
import { UpdatesHomeView } from "./components/UpdatesHomeView";
import { AddUpdateVersionView } from "./components/AddUpdateVersionView";
import { UpdateVersionDetailsView } from "./components/UpdateVersionDetailsView";

export enum AdminView {
  HOME = "home",
  ADD = "add",
  DETAILS = "details",
}

export const UpdateAdminApp = () => {
  const [activeView, setActiveView] = useState<AdminView>(AdminView.HOME);
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);
  const [selectedVersion, setSelectedVersion] = useState<UpdateVersion | null>(
    null
  );

  const updates = useMemo<UpdateVersion[]>(
    () => [
      {
        id: "1",
        softwareType: ClientSoftwareType.FEX,
        name: "FEX Desktop",
        version: "2.3.1",
        packageType: PackageType.MSI,
        architecture: Architecture.AMD64,
        releaseDate: "2024-03-21",
        status: UpdateStatus.CURRENT,
        isCurrent: true,
        descriptionFile: "fex-desktop-2.3.1.json",
        packageFile: "fex-desktop-2.3.1.msi",
        security: {
          shouldEncrypt: false,
          shouldHash: true,
          shouldSign: true,
        },
      },
      {
        id: "2",
        softwareType: ClientSoftwareType.MAIL,
        name: "MailPro",
        version: "5.0.0",
        packageType: PackageType.DEB,
        architecture: Architecture.AMD64,
        releaseDate: "2024-02-14",
        status: UpdateStatus.AVAILABLE,
        isCurrent: false,
        descriptionFile: "mailpro-5.0.0.json",
        packageFile: "mailpro-5.0.0.deb",
        security: {
          shouldEncrypt: true,
          shouldHash: true,
          shouldSign: true,
        },
      },
      {
        id: "3",
        softwareType: ClientSoftwareType.IM,
        name: "SecureChat",
        version: "1.8.5",
        packageType: PackageType.RPM,
        architecture: Architecture.ARM,
        releaseDate: "2023-11-08",
        status: UpdateStatus.ARCHIVE,
        isCurrent: false,
        descriptionFile: "securechat-1.8.5.json",
        packageFile: "securechat-1.8.5.rpm",
        security: {
          shouldEncrypt: true,
          shouldHash: true,
          shouldSign: false,
        },
      },
    ],
    []
  );

  const currentVersion = useMemo(
    () => updates.find((item) => item.isCurrent) ?? null,
    [updates]
  );

  const filteredUpdates = useMemo(() => {
    return updates.filter((update) => {
      const matchesSoftwareType =
        filters.softwareTypes.length === 0 ||
        filters.softwareTypes.includes(update.softwareType);
      const matchesPackageType =
        filters.packageTypes.length === 0 ||
        filters.packageTypes.includes(update.packageType);
      const matchesVersion =
        filters.version.trim().length === 0 ||
        update.version.includes(filters.version.trim());
      const [from, to] = filters.dateRange;
      const matchesDateRange =
        (!from || update.releaseDate >= from) &&
        (!to || update.releaseDate <= to);

      return (
        matchesSoftwareType &&
        matchesPackageType &&
        matchesVersion &&
        matchesDateRange
      );
    });
  }, [filters, updates]);

  const handleOpenDetails = (version: UpdateVersion) => {
    setSelectedVersion(version);
    setActiveView(AdminView.DETAILS);
  };

  const handleCloseDetails = () => {
    setSelectedVersion(null);
    setActiveView(AdminView.HOME);
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div>
          <h1>Администратор обновлений клиентского ПО</h1>
          <p>Управление версиями, пакетами и безопасностью обновлений</p>
        </div>
        <nav className={styles.navigation}>
          <button
            className={
              activeView === AdminView.HOME ? styles.activeNavButton : ""
            }
            onClick={() => setActiveView(AdminView.HOME)}
          >
            Домашняя страница
          </button>
          <button
            className={
              activeView === AdminView.ADD ? styles.activeNavButton : ""
            }
            onClick={() => setActiveView(AdminView.ADD)}
          >
            Добавление версии
          </button>
          {selectedVersion ? (
            <button
              className={
                activeView === AdminView.DETAILS ? styles.activeNavButton : ""
              }
              onClick={() => setActiveView(AdminView.DETAILS)}
            >
              Просмотр версии
            </button>
          ) : null}
        </nav>
      </header>
      <main className={styles.content}>
        {activeView === AdminView.HOME ? (
          <UpdatesHomeView
            updates={filteredUpdates}
            currentVersion={currentVersion}
            filters={filters}
            onFiltersChange={setFilters}
            onAddNew={() => setActiveView(AdminView.ADD)}
            onSelectVersion={handleOpenDetails}
          />
        ) : null}
        {activeView === AdminView.ADD ? (
          <AddUpdateVersionView onBack={() => setActiveView(AdminView.HOME)} />
        ) : null}
        {activeView === AdminView.DETAILS && selectedVersion ? (
          <UpdateVersionDetailsView
            version={selectedVersion}
            onClose={handleCloseDetails}
          />
        ) : null}
      </main>
    </div>
  );
};
