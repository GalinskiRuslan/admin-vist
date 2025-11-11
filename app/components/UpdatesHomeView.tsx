import styles from "./updates-home-view.module.css";
import { FiltersState, UpdateVersion } from "../types";
import { FiltersPanel } from "./filters/FiltersPanel";
import { UpdatesList } from "./UpdatesList";

export type UpdatesHomeViewProps = {
  updates: UpdateVersion[];
  filters: FiltersState;
  currentVersion: UpdateVersion | null;
  onFiltersChange: (nextFilters: FiltersState) => void;
  onAddNew: () => void;
  onSelectVersion: (version: UpdateVersion) => void;
};

export const UpdatesHomeView = ({
  updates,
  filters,
  currentVersion,
  onFiltersChange,
  onAddNew,
  onSelectVersion,
}: UpdatesHomeViewProps) => {
  const activeVersion = currentVersion;
  return (
    <section className={styles.container}>
      <div className={styles.headingRow}>
        <div>
          <h2>Домашняя страница</h2>
          <p>Обзор текущих обновлений и инструментов фильтрации</p>
        </div>
        <button className={styles.addButton} onClick={onAddNew}>
          Добавить новую версию
        </button>
      </div>
      <div className={styles.contentGrid}>
        <FiltersPanel filters={filters} onFiltersChange={onFiltersChange} />
        <div className={styles.listColumn}>
          <UpdatesList updates={updates} onSelectVersion={onSelectVersion} />
          {activeVersion ? (
            <div className={styles.highlightBox}>
              <h3>Актуальная версия</h3>
              <dl>
                <div>
                  <dt>Клиентское ПО</dt>
                  <dd>
                    {activeVersion.name} ({activeVersion.softwareType})
                  </dd>
                </div>
                <div>
                  <dt>Версия</dt>
                  <dd>{activeVersion.version}</dd>
                </div>
                <div>
                  <dt>Пакет</dt>
                  <dd>{activeVersion.packageType}</dd>
                </div>
                <div>
                  <dt>Дата публикации</dt>
                  <dd>{activeVersion.releaseDate}</dd>
                </div>
              </dl>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};
