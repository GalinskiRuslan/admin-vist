"use client";

import { useState } from "react";
import styles from "./add-update-version-view.module.css";
import {
  Architecture,
  ClientSoftwareType,
  PackageType,
  UpdateStatus,
} from "../types";
import UpdateService from "../services/updateService";

// Явно задаём возможные значения для union-типов
const SOFTWARE_TYPES: ClientSoftwareType[] = [
  "client-fex",
  "client-mail",
  "client-im",
];

const SOFTWARE_LABELS: Record<ClientSoftwareType, string> = {
  "client-fex": "ФЕКС клиент",
  "client-mail": "Почтовый клиент",
  "client-im": "Инстант мессенджер",
};

// если в PackageType больше вариантов – добавь сюда
const PACKAGE_TYPES: PackageType[] = ["MSI", "DEB", "RPM"] as PackageType[];

// если в Architecture больше вариантов – добавь сюда
const ARCHITECTURES: Architecture[] = ["AMD64", "ARM"] as Architecture[];

// UpdateStatus, судя по использованию, enum – Object.values норм
const STATUS_OPTIONS = Object.values(UpdateStatus) as UpdateStatus[];

type AddUpdateVersionViewProps = {
  onBack: () => void;
};

type FormState = {
  softwareType: ClientSoftwareType | "";
  productName: string;
  version: string;
  releaseDate: string;
  packageType: PackageType | "";
  architecture: Architecture | "";
  status: UpdateStatus | "";
  descriptionFile: File | null;
  packageFile: File | null;
  shouldEncrypt: boolean;
  shouldHash: boolean;
  shouldSign: boolean;
};

const initialFormState: FormState = {
  softwareType: "",
  productName: "",
  version: "",
  releaseDate: "",
  packageType: "",
  architecture: "",
  status: UpdateStatus.AVAILABLE,
  descriptionFile: null,
  packageFile: null,
  shouldEncrypt: false,
  shouldHash: true,
  shouldSign: true,
};

// утилита для SHA-256
async function computeSha256(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// маппинг статуса UI -> статус API (draft/published/archived)
function mapStatusToApi(
  status: UpdateStatus | ""
): "draft" | "published" | "archived" {
  if (!status) return "draft";

  switch (status) {
    case UpdateStatus.ARCHIVE:
      return "archived";
    case UpdateStatus.CURRENT:
    case UpdateStatus.AVAILABLE:
    default:
      return "published";
  }
}

export const AddUpdateVersionView = ({ onBack }: AddUpdateVersionViewProps) => {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    // простая валидация
    if (!form.softwareType) {
      setError("Выберите тип клиентского ПО");
      return;
    }
    if (!form.packageFile) {
      setError("Выберите файл пакета обновления");
      return;
    }
    if (!form.version.trim()) {
      setError("Укажите версию");
      return;
    }

    try {
      setLoading(true);

      // считаем sha256 от файла
      const sha256 = await computeSha256(form.packageFile);

      // подпись — пока заглушка (сервер, по твоим словам, сейчас проверяет её «заглушкой»)
      const sign = sha256; // можно сделать "dummy-signature", если нужно

      // API ждёт целое число версии. Пока сделаем простую конвертацию:
      // убираем всё, кроме цифр, и парсим. Если пусто — ставим 1.
      const versionNumericString = form.version.replace(/\D/g, "");
      const versionNumber = versionNumericString
        ? Number(versionNumericString)
        : 1;

      const statusApi = mapStatusToApi(form.status);

      // TODO: сейчас нет поля OS в форме — временно хардкодим Windows
      const os: "Windows" | "Linux" | "Android" | "iOS" = "Windows";

      await UpdateService.uploadRelease({
        appName: form.softwareType, // client-fex / client-mail / client-im
        os,
        version: versionNumber,
        file: form.packageFile,
        fileName: form.packageFile.name,
        sha256,
        sign,
        status: statusApi,
        // releaseNotes можно будет взять из JSON-описания, если захочешь распарсить
      });

      setSuccess("Релиз успешно загружен");
      setForm(initialFormState);
    } catch (e) {
      console.error(e);
      setError(
        "Не удалось загрузить релиз. Проверьте данные и попробуйте ещё раз."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div>
          <h2>Добавление новой версии пакета</h2>
          <p>Заполните метаданные и загрузите файлы обновления</p>
        </div>
        <button className={styles.backButton} onClick={onBack}>
          Назад к списку
        </button>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <fieldset className={styles.block}>
          <legend>Основные сведения</legend>

          <label>
            <span>Тип клиентского ПО</span>
            <select
              value={form.softwareType}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  softwareType: event.target.value as ClientSoftwareType,
                }))
              }
            >
              <option value="">Выберите тип</option>
              {SOFTWARE_TYPES.map((value) => (
                <option key={value} value={value}>
                  {SOFTWARE_LABELS[value]}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Название продукта</span>
            <input
              type="text"
              value={form.productName}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  productName: event.target.value,
                }))
              }
              placeholder="Например, FEX Desktop"
            />
          </label>

          <label>
            <span>Версия</span>
            <input
              type="text"
              value={form.version}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, version: event.target.value }))
              }
              placeholder="Например, 2.3.1"
            />
          </label>

          <label>
            <span>Дата публикации</span>
            <input
              type="date"
              value={form.releaseDate}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  releaseDate: event.target.value,
                }))
              }
            />
          </label>
        </fieldset>

        <fieldset className={styles.block}>
          <legend>Пакет обновления</legend>

          <label>
            <span>Тип пакета</span>
            <select
              value={form.packageType}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  packageType: event.target.value as PackageType,
                }))
              }
            >
              <option value="">Выберите формат</option>
              {PACKAGE_TYPES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Архитектура</span>
            <select
              value={form.architecture}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  architecture: event.target.value as Architecture,
                }))
              }
            >
              <option value="">Выберите архитектуру</option>
              {ARCHITECTURES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.fileField}>
            <span>JSON описание версии</span>
            <input
              type="file"
              accept="application/json"
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  descriptionFile: event.target.files?.[0] ?? null,
                }))
              }
            />
            {form.descriptionFile ? (
              <small>Выбран файл: {form.descriptionFile.name}</small>
            ) : (
              <small>Файл метаинформации с описанием версии</small>
            )}
          </label>

          <label className={styles.fileField}>
            <span>Пакет обновления</span>
            <input
              type="file"
              accept=".msi,.deb,.rpm"
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  packageFile: event.target.files?.[0] ?? null,
                }))
              }
            />
            {form.packageFile ? (
              <small>Выбран файл: {form.packageFile.name}</small>
            ) : (
              <small>Бинарный инсталляционный пакет (MSI/DEB/RPM)</small>
            )}
          </label>
        </fieldset>

        <fieldset className={styles.block}>
          <legend>Безопасность</legend>

          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={form.shouldHash}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  shouldHash: event.target.checked,
                }))
              }
            />
            <span>Рассчитать контрольную сумму пакета</span>
          </label>

          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={form.shouldSign}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  shouldSign: event.target.checked,
                }))
              }
            />
            <span>Подписать пакет электронной подписью</span>
          </label>

          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={form.shouldEncrypt}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  shouldEncrypt: event.target.checked,
                }))
              }
            />
            <span>Зашифровать пакет для ограниченного распространения</span>
          </label>
        </fieldset>

        <fieldset className={styles.block}>
          <legend>Публикация</legend>

          <label>
            <span>Статус версии</span>
            <select
              value={form.status}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  status: event.target.value as UpdateStatus,
                }))
              }
            >
              {STATUS_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <p className={styles.helper}>
            После заполнения формы появится возможность расчета хеша, подписи и
            загрузки файлов.
          </p>
        </fieldset>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onBack}
            disabled={loading}
          >
            Отменить
          </button>
          <button
            type="submit"
            className={styles.primaryButton}
            disabled={loading}
          >
            {loading ? "Загружаем..." : "Сохранить версию"}
          </button>
        </div>
      </form>
    </section>
  );
};
