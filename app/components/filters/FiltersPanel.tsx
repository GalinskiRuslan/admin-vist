"use client";

import { useMemo } from "react";
import styles from "./filters-panel.module.css";
import {
  ClientSoftwareType,
  FiltersState,
  PackageType,
} from "../../types";
import { MultiSelectFilter } from "./MultiSelectFilter";
import { TextFilter } from "./TextFilter";
import { DateRangeFilter } from "./DateRangeFilter";

export type FiltersPanelProps = {
  filters: FiltersState;
  onFiltersChange: (nextFilters: FiltersState) => void;
};

const softwareOptions = Object.values(ClientSoftwareType).map((label) => ({
  label,
  value: label,
}));

const packageOptions = Object.values(PackageType).map((label) => ({
  label,
  value: label,
}));

export const FiltersPanel = ({ filters, onFiltersChange }: FiltersPanelProps) => {
  const selectedSoftwareTypes = useMemo(
    () => new Set(filters.softwareTypes),
    [filters.softwareTypes]
  );

  const selectedPackageTypes = useMemo(
    () => new Set(filters.packageTypes),
    [filters.packageTypes]
  );

  return (
    <aside className={styles.panel}>
      <h3>Фильтры</h3>
      <MultiSelectFilter
        title="Типы клиентского ПО"
        options={softwareOptions}
        selected={selectedSoftwareTypes}
        onChange={(values) =>
          onFiltersChange({
            ...filters,
            softwareTypes: Array.from(values) as ClientSoftwareType[],
          })
        }
      />
      <MultiSelectFilter
        title="Типы пакетов"
        options={packageOptions}
        selected={selectedPackageTypes}
        onChange={(values) =>
          onFiltersChange({
            ...filters,
            packageTypes: Array.from(values) as PackageType[],
          })
        }
      />
      <TextFilter
        title="Номер версии"
        placeholder="Например, 2.3.1"
        value={filters.version}
        onChange={(value) => onFiltersChange({ ...filters, version: value })}
      />
      <DateRangeFilter
        title="Диапазон публикации"
        from={filters.dateRange[0]}
        to={filters.dateRange[1]}
        onChange={(nextRange) =>
          onFiltersChange({ ...filters, dateRange: nextRange })
        }
      />
    </aside>
  );
};
