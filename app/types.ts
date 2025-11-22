export type ClientSoftwareType = "client-fex" | "client-mail" | "client-im";

export type PackageType = "MSI" | "DEB" | "RPM" | "EXE" | "APK" | "IPA";

export enum Architecture {
  AMD64 = "AMD64 (x86-64)",
  ARM = "ARM",
}

export enum UpdateStatus {
  CURRENT = "CURRENT",
  AVAILABLE = "AVAILABLE",
  ARCHIVE = "ARCHIVE",
}

export type PackageSecurityOptions = {
  shouldEncrypt: boolean;
  shouldSign: boolean;
  shouldHash: boolean;
};

export interface UpdateVersion {
  id: string;
  os: string;
  appName: string;
  softwareType: ClientSoftwareType;
  version: string;
  packageType: PackageType;
  architecture: string;
  releaseDate: string;
  status: UpdateStatus;
  isCurrent: any;
}

export type FiltersState = {
  softwareTypes: ClientSoftwareType[];
  packageTypes: PackageType[];
  version: string;
  dateRange: [string, string];
};

export const DEFAULT_FILTERS: FiltersState = {
  softwareTypes: [],
  packageTypes: [],
  version: "",
  dateRange: ["", ""],
};
