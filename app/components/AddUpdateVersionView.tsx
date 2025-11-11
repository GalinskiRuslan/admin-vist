import { useState } from "react";
import styles from "./add-update-version-view.module.css";
import {
  Architecture,
  ClientSoftwareType,
  PackageType,
  UpdateStatus,
} from "../types";

const softwareOptions = Object.values(ClientSoftwareType);
const packageOptions = Object.values(PackageType);
const architectureOptions = Object.values(Architecture);
const statusOptions = Object.values(UpdateStatus);

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

export const AddUpdateVersionView = ({ onBack }: AddUpdateVersionViewProps) => {
  const [form, setForm] = useState<FormState>(initialFormState);

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

      <form className={styles.form}>
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
              {softwareOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
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
                setForm((prev) => ({ ...prev, productName: event.target.value }))
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
                setForm((prev) => ({ ...prev, releaseDate: event.target.value }))
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
              {packageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
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
              {architectureOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
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
                setForm((prev) => ({ ...prev, shouldHash: event.target.checked }))
              }
            />
            <span>Рассчитать контрольную сумму пакета</span>
          </label>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={form.shouldSign}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, shouldSign: event.target.checked }))
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
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <p className={styles.helper}>
            После заполнения формы появится возможность расчета хеша, подписи и
            загрузки файлов.
          </p>
        </fieldset>

        <div className={styles.actions}>
          <button type="button" className={styles.secondaryButton} onClick={onBack}>
            Отменить
          </button>
          <button type="submit" className={styles.primaryButton} disabled>
            Сохранить версию (демо)
          </button>
        </div>
      </form>
    </section>
  );
};
