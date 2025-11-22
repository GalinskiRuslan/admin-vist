"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "./components/AdminLayout";
import { UpdatesHomeView } from "./components/UpdatesHomeView";
import {
  ClientSoftwareType,
  DEFAULT_FILTERS,
  FiltersState,
  PackageType,
  UpdateStatus,
  UpdateVersion,
} from "./types";
import UpdateService, { OS, PublicVersion } from "./services/updateService"; // путь подправь, если надо

// захардкоженные приложения и ОС
const APPS = ["client-fex", "client-mail", "client-im"] as const;
const OS_LIST: OS[] = ["Windows", "Linux", "Android", "iOS"];

// appName -> человекочитаемый тип ПО
function getSoftwareType(appName: string): string {
  switch (appName) {
    case "client-fex":
      return "ФЕКС клиент";
    case "client-mail":
      return "Почтовый клиент";
    case "client-im":
      return "Инстант мессенджер";
    default:
      return appName;
  }
}
function getSoftwareTypeLabel(type: ClientSoftwareType): string {
  switch (type) {
    case "client-fex":
      return "ФЕКС клиент";
    case "client-mail":
      return "Почтовый клиент";
    case "client-im":
      return "Инстант мессенджер";
    default:
      return type;
  }
}

// вытащить расширение файла из пути
function getPackageType(relativePath: string): PackageType {
  const ext = relativePath.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "msi":
      return "MSI";
    case "deb":
      return "DEB";
    case "rpm":
      return "RPM";
    case "exe":
      return "EXE";
    case "apk":
      return "APK";
    case "ipa":
      return "IPA";
    // если в типе есть ещё варианты — добавь сюда
    default:
      // либо отдельное значение в типе, например "OTHER"
      // return "OTHER";
      // либо, если хочешь жёстко ограничить, можешь временно сделать заглушку:
      return "EXE"; // или любой дефолт, который точно входит в PackageType
  }
}

// примитивно определим архитектуру по имени файла
function getArchitecture(relativePath: string): string {
  const lower = relativePath.toLowerCase();
  if (lower.includes("arm")) return "ARM";
  if (
    lower.includes("amd64") ||
    lower.includes("x64") ||
    lower.includes("x86_64")
  ) {
    return "AMD64";
  }
  return "UNKNOWN";
}

// маппим PublicVersion -> UpdateVersion (без isCurrent/status)
function baseMapPublicToUpdateVersion(v: PublicVersion): UpdateVersion {
  // appName по факту и есть ClientSoftwareType
  const softwareType = v.appName as ClientSoftwareType;

  return {
    id: `${v.appName}-${v.os}-${v.version}`,
    appName: v.appName,
    os: v.os,
    softwareType, // ✅ тут строго ClientSoftwareType
    version: String(v.version),
    packageType: getPackageType(v.relativePath),
    architecture: getArchitecture(v.relativePath),
    releaseDate: v.publishedAt
      ? new Date(v.publishedAt).toISOString().slice(0, 10)
      : "",
    status: UpdateStatus.AVAILABLE,
    isCurrent: false,
  };
}
// пометить актуальные версии (по max version на каждую пару appName+os)
function buildUpdateVersions(all: PublicVersion[]): UpdateVersion[] {
  const byKey = new Map<string, PublicVersion[]>();

  for (const v of all) {
    const key = `${v.appName}-${v.os}`;
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key)!.push(v);
  }

  const result: UpdateVersion[] = [];

  for (const [key, versions] of byKey.entries()) {
    if (versions.length === 0) continue;

    // ищем максимальную версию (числовое поле version)
    let latest = versions[0];
    for (const v of versions) {
      if (v.version > latest.version) latest = v;
    }

    for (const v of versions) {
      const mapped = baseMapPublicToUpdateVersion(v);
      if (
        v.appName === latest.appName &&
        v.os === latest.os &&
        v.version === latest.version
      ) {
        mapped.isCurrent = true;
        mapped.status = UpdateStatus.CURRENT;
      } else {
        mapped.isCurrent = false;
        mapped.status = UpdateStatus.AVAILABLE;
      }
      result.push(mapped);
    }
  }

  return result;
}

export const UpdateAdminApp = () => {
  const router = useRouter();

  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);
  const [updates, setUpdates] = useState<UpdateVersion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const promises: ReturnType<typeof UpdateService.listReleases>[] = [];

        for (const appName of APPS) {
          for (const os of OS_LIST) {
            promises.push(UpdateService.listReleases(appName, os, 10, 0));
          }
        }

        const results = await Promise.all(promises);

        const allPublic: PublicVersion[] = [];
        for (const res of results) {
          const versions = res.data.versions || [];
          allPublic.push(...versions);
        }

        const mapped = buildUpdateVersions(allPublic);
        setUpdates(mapped);
      } catch (e) {
        console.error("Ошибка загрузки версий:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

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
        (!from || (update.releaseDate && update.releaseDate >= from)) &&
        (!to || (update.releaseDate && update.releaseDate <= to));

      return (
        matchesSoftwareType &&
        matchesPackageType &&
        matchesVersion &&
        matchesDateRange
      );
    });
  }, [filters, updates]);

  return (
    <AdminLayout>
      <UpdatesHomeView
        updates={filteredUpdates}
        currentVersion={currentVersion}
        filters={filters}
        onFiltersChange={setFilters}
        onAddNew={() => router.push("/add")}
        onSelectVersion={(version) => router.push(`/details/${version.id}`)}
        // если UpdatesHomeView умеет показывать лоадер — можно добавить проп loading
        // loading={loading}
      />
    </AdminLayout>
  );
};
