"use client";
import { useMemo, useState } from "react";
import styles from "./update-version-details-view.module.css";
import { UpdateStatus, UpdateVersion } from "../types";

type UpdateVersionDetailsViewProps = {
  version: UpdateVersion;
  onClose: () => void;
};

type StatusHistoryEntry = {
  status: UpdateStatus;
  updatedAt: string;
  comment: string;
};

const mockHistory: StatusHistoryEntry[] = [
  {
    status: UpdateStatus.CURRENT,
    updatedAt: "2024-03-21",
    comment: "Версия отмечена актуальной для всех клиентов",
  },
  {
    status: UpdateStatus.AVAILABLE,
    updatedAt: "2024-03-10",
    comment: "Опубликована для этапа пилотного распространения",
  },
  {
    status: UpdateStatus.ARCHIVE,
    updatedAt: "2023-12-01",
    comment: "Перемещена в архив, заменена более новой версией",
  },
];

export const UpdateVersionDetailsView = ({
  version,
  onClose,
}: UpdateVersionDetailsViewProps) => {
  const [status, setStatus] = useState<UpdateStatus>(version.status);
  const history = useMemo(() => mockHistory, []);

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div>
          <h2>Просмотр версии {version.version}</h2>
          <p>
            Управление статусом, просмотр файлов и опций безопасности выбранного
            обновления
          </p>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          Вернуться к списку
        </button>
      </header>

      <div className={styles.grid}>
        <section className={styles.card}>
          <h3>Основная информация</h3>
          <dl>
            <div>
              <dt>Название</dt>
              <dd>{version.name}</dd>
            </div>
            <div>
              <dt>Тип ПО</dt>
              <dd>{version.softwareType}</dd>
            </div>
            <div>
              <dt>Версия</dt>
              <dd>{version.version}</dd>
            </div>
            <div>
              <dt>Дата публикации</dt>
              <dd>{version.releaseDate}</dd>
            </div>
            <div>
              <dt>Архитектура</dt>
              <dd>{version.architecture}</dd>
            </div>
          </dl>
        </section>

        <section className={styles.card}>
          <h3>Файлы</h3>
          <ul className={styles.filesList}>
            <li>
              <span>Описание версии</span>
              <span>{version.descriptionFile}</span>
            </li>
            <li>
              <span>Пакет обновления</span>
              <span>{version.packageFile}</span>
            </li>
          </ul>
          <div className={styles.fileActions}>
            <button type="button">Скачать пакет</button>
            <button type="button">Проверить подпись</button>
            <button type="button">Рассчитать хеш</button>
          </div>
        </section>

        <section className={styles.card}>
          <h3>Статус обновления</h3>
          <label className={styles.statusControl}>
            <span>Текущий статус</span>
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as UpdateStatus)
              }
            >
              {Object.values(UpdateStatus).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <p className={styles.helper}>
            В рабочем решении изменение статуса сохранится через API и будет
            отражено в истории версий.
          </p>
        </section>

        <section className={styles.card}>
          <h3>Безопасность</h3>
          <ul className={styles.securityList}>
            <li>
              <span>Контрольная сумма</span>
              <span>
                {version.security.shouldHash ? "Рассчитана" : "Ожидает"}
              </span>
            </li>
            <li>
              <span>Цифровая подпись</span>
              <span>
                {version.security.shouldSign ? "Подписан" : "Без подписи"}
              </span>
            </li>
            <li>
              <span>Шифрование</span>
              <span>
                {version.security.shouldEncrypt
                  ? "Шифрование включено"
                  : "Без шифрования"}
              </span>
            </li>
          </ul>
        </section>

        <section className={styles.card}>
          <h3>История статусов</h3>
          <ul className={styles.historyList}>
            {history.map((entry, index) => (
              <li key={`${entry.status}-${index}`}>
                <div>
                  <strong>{entry.status}</strong>
                  <time>{entry.updatedAt}</time>
                </div>
                <p>{entry.comment}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
};
