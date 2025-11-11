"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AdminLayout } from "./components/AdminLayout";
import { UpdatesHomeView } from "./components/UpdatesHomeView";
import { MOCK_UPDATES } from "./mock-data";
import { DEFAULT_FILTERS, FiltersState, UpdateVersion } from "./types";

export const UpdateAdminApp = () => {
  const router = useRouter();
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);

  const updates = useMemo<UpdateVersion[]>(() => MOCK_UPDATES, []);

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

  return (
    <AdminLayout>
      <UpdatesHomeView
        updates={filteredUpdates}
        currentVersion={currentVersion}
        filters={filters}
        onFiltersChange={setFilters}
        onAddNew={() => router.push("/add")}
        onSelectVersion={(version) => router.push(`/details/${version.id}`)}
      />
    </AdminLayout>
  );
};
