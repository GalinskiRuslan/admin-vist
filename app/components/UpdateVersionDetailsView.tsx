// src/app/components/UpdateDetailsView.tsx
"use client";

import { useEffect, useState } from "react";
import UpdateService, { OS, PublicVersion } from "../services/updateService";
import styles from "./update-version-details-view.module.css";

type UpdateDetailsViewProps = {
  appName: string; // "client-fex" | "client-mail" | "client-im"
  os: OS; // "Windows" | "Linux" | "Android" | "iOS"
  version: number; // номер версии из API (целое число)
  onBack?: () => void;
};

export const UpdateDetailsView = ({
  appName,
  os,
  version,
  onBack,
}: UpdateDetailsViewProps) => {
  const [data, setData] = useState<PublicVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await UpdateService.getRelease(appName, os, version);

        if (!cancelled) {
          setData(res.data);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setError("Не удалось загрузить данные версии");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [appName, os, version]);

  const handleDelete = async () => {
    if (!confirm("Вы уверены, что хотите удалить этот релиз?")) return;

    try {
      setDeleting(true);
      setDeleteError(null);

      await UpdateService.deleteRelease(appName, os, version);

      // Успешно удалили — уходим назад
      if (onBack) {
        onBack();
      } else {
        // запасной вариант
        window.history.back();
      }
    } catch (e) {
      console.error(e);
      setDeleteError("Не удалось удалить релиз");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className={styles.wrapper}>Загружаем данные версии…</div>;
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.error}>{error}</p>
        {onBack && (
          <button className={styles.backButton} onClick={onBack}>
            Назад
          </button>
        )}
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.wrapper}>
        <p>Данные версии не найдены</p>
        {onBack && (
          <button className={styles.backButton} onClick={onBack}>
            Назад
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div>
          <h2>
            {data.appName} — {data.os}
          </h2>
          <p>Версия: {data.version}</p>
        </div>
        <div className={styles.headerActions}>
          {onBack && (
            <button className={styles.backButton} onClick={onBack}>
              Назад к списку
            </button>
          )}
          <button
            type="button"
            className={styles.deleteButton}
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Удаляем..." : "Удалить релиз"}
          </button>
        </div>
      </header>

      {deleteError && <p className={styles.error}>{deleteError}</p>}

      <section className={styles.block}>
        <h3>Общие сведения</h3>
        <dl className={styles.dl}>
          <div>
            <dt>Приложение</dt>
            <dd>{data.appName}</dd>
          </div>
          <div>
            <dt>ОС</dt>
            <dd>{data.os}</dd>
          </div>
          <div>
            <dt>Версия</dt>
            <dd>{data.version}</dd>
          </div>
          <div>
            <dt>Размер файла</dt>
            <dd>{(data.fileSize / (1024 * 1024)).toFixed(2)} МБ</dd>
          </div>
          <div>
            <dt>Путь к файлу</dt>
            <dd>{data.relativePath}</dd>
          </div>
          <div>
            <dt>Дата публикации</dt>
            <dd>{data.publishedAt ?? "—"}</dd>
          </div>
        </dl>
      </section>

      <section className={styles.block}>
        <h3>Контрольная сумма</h3>
        <p className={styles.mono}>{data.sha256}</p>
      </section>

      {data.releaseNotes && (
        <section className={styles.block}>
          <h3>Описание версии</h3>
          <pre className={styles.releaseNotes}>{data.releaseNotes}</pre>
        </section>
      )}
    </div>
  );
};
