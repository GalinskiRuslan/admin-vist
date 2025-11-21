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

/**
 * Так как ClientSoftwareType — union type, а не enum,
 * мы явно задаём массив всех значений.
 */
const SOFTWARE_TYPES: ClientSoftwareType[] = [
  "client-fex",
  "client-mail",
  "client-im",
];

/** Маппинг технического значения -> человекочитаемый label */
const SOFTWARE_LABELS: Record<ClientSoftwareType, string> = {
  "client-fex": "ФЕКС клиент",
  "client-mail": "Почтовый клиент",
  "client-im": "Инстант мессенджер",
};

const softwareOptions = SOFTWARE_TYPES.map((value) => ({
  value, // "client-fex" | "client-mail" | "client-im"
  label: SOFTWARE_LABELS[value],
}));

/**
 * Аналогично для PackageType: он тоже union type,
 * поэтому задаём список значений руками.
 * Подставь сюда свои реальные значения, если они другие.
 */
const PACKAGE_TYPES: PackageType[] = ["MSI", "DEB", "RPM", "EXE", "APK", "IPA"];

const packageOptions = PACKAGE_TYPES.map((value) => ({
  value,
  label: value,
}));

export const FiltersPanel = ({
  filters,
  onFiltersChange,
}: FiltersPanelProps) => {
  // MultiSelectFilter, скорее всего, ждёт Set<string>.
  // Наши union-типы совместимы со string, поэтому всё ок.
  const selectedSoftwareTypes = useMemo(
    () => new Set<string>(filters.softwareTypes),
    [filters.softwareTypes]
  );

  const selectedPackageTypes = useMemo(
    () => new Set<string>(filters.packageTypes),
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
