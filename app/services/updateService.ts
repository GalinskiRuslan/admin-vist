// src/services/updateService.ts
import { AxiosResponse } from "axios";
import $api from "../http";

export type OS = "Windows" | "Linux" | "Android" | "iOS";

export interface PublicVersion {
  appName: string;
  os: OS;
  version: number;
  relativePath: string;
  sha256: string;
  sign: string;
  fileSize: number;
  releaseNotes?: string;
  publishedAt?: string;
}
export interface AdminRelease {
  appName: string;
  os: OS;
  version: number;
  status: ReleaseStatus;
  relativePath: string;
  fileSize: number;
  sha256: string;
  releaseNotes?: string;
  publishedAt?: string;
}
export type ReleaseStatus = "draft" | "published" | "archived";
export default class UpdateService {
  static async listReleases(
    appName: string,
    os: OS,
    limit = 10,
    offset = 0
  ): Promise<
    AxiosResponse<{
      appName: string;
      os: OS;
      versions: PublicVersion[];
    }>
  > {
    return $api.get(
      `/vista/api/v2/application-update/releases/${encodeURIComponent(
        appName
      )}/${os}`,
      {
        params: { limit, offset },
      }
    );
  }
  static async uploadRelease(params: {
    appName: string;
    os: OS;
    version: number;
    file: File; // бинарник: msi/deb/rpm/...
    fileName?: string; // если хочешь переопределить имя
    sha256: string; // уже посчитанный хеш файла
    sign: string; // подпись sha256 (строка)
    status: ReleaseStatus; // "draft" | "published" | "archived"
    releaseNotes?: string;
    idempotencyKey?: string; // Idempotency-Key из доки (опционально)
  }): Promise<AxiosResponse<AdminRelease>> {
    const {
      appName,
      os,
      version,
      file,
      fileName,
      sha256,
      sign,
      status,
      releaseNotes,
      idempotencyKey,
    } = params;

    const formData = new FormData();
    formData.append("appName", appName);
    formData.append("os", os);
    formData.append("version", String(version));
    formData.append("file", file);
    if (fileName) {
      formData.append("fileName", fileName);
    }
    formData.append("sha256", sha256);
    formData.append("sign", sign);
    formData.append("status", status);
    if (releaseNotes) {
      formData.append("releaseNotes", releaseNotes);
    }

    const headers: Record<string, string> = {
      // Content-Type с boundary браузер сам подставит
    };
    if (idempotencyKey) {
      headers["Idempotency-Key"] = idempotencyKey;
    }

    return $api.post<AdminRelease>(
      "/vista/api/v2/application-update/admin/releases/upload",
      formData,
      { headers }
    );
  }
  static async getRelease(
    appName: string,
    os: OS,
    version: number
  ): Promise<AxiosResponse<PublicVersion>> {
    return $api.get(
      `/vista/api/v2/application-update/releases/${encodeURIComponent(
        appName
      )}/${os}/${version}`
    );
  }
  static async patchRelease(
    appName: string,
    os: OS,
    version: number,
    payload: {
      status?: ReleaseStatus;
      releaseNotes?: string;
    }
  ): Promise<AxiosResponse<AdminRelease>> {
    return $api.patch<AdminRelease>(
      `/vista/api/v2/application-update/admin/releases/${encodeURIComponent(
        appName
      )}/${os}/${version}`,
      payload
    );
  }
  static async deleteRelease(
    appName: string,
    os: OS,
    version: number
  ): Promise<AxiosResponse<void>> {
    return $api.delete<void>(
      `/vista/api/v2/application-update/admin/releases/${encodeURIComponent(
        appName
      )}/${os}/${version}`
    );
  }
}
