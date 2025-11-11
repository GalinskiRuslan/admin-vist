"use client";

import styles from "./updates-list.module.css";
import { UpdateStatus, UpdateVersion } from "../types";

type UpdatesListProps = {
  updates: UpdateVersion[];
  onSelectVersion: (version: UpdateVersion) => void;
};

const statusColors: Record<UpdateStatus, string> = {
  [UpdateStatus.CURRENT]: "#16a34a",
  [UpdateStatus.AVAILABLE]: "#2563eb",
  [UpdateStatus.ARCHIVE]: "#475569",
};

export const UpdatesList = ({ updates, onSelectVersion }: UpdatesListProps) => {
  return (
    <div className={styles.block}>
      <div className={styles.tableHead}>
        <span>ПО</span>
        <span>Версия</span>
        <span>Пакет</span>
        <span>Архитектура</span>
        <span>Дата публикации</span>
        <span>Статус</span>
        <span>Действия</span>
      </div>
      <div className={styles.rows}>
        {updates.map((update) => (
          <div key={update.id} className={styles.row}>
            <span className={styles.nameBlock}>
              <strong>{update.name}</strong>
              <small>{update.softwareType}</small>
            </span>
            <span>{update.version}</span>
            <span>{update.packageType}</span>
            <span>{update.architecture}</span>
            <span>{update.releaseDate}</span>
            <span>
              <span
                className={styles.statusBadge}
                style={{ backgroundColor: statusColors[update.status] }}
              >
                {update.status}
              </span>
            </span>
            <span>
              <button
                className={styles.linkButton}
                onClick={() => onSelectVersion(update)}
              >
                Подробнее
              </button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
