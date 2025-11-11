export enum ClientSoftwareType {
  FEX = "FEX клиент",
  MAIL = "Почтовый клиент",
  IM = "Инстант мессенджер",
}

export enum PackageType {
  MSI = "MSI",
  DEB = "DEB",
  RPM = "RPM",
}

export enum Architecture {
  AMD64 = "AMD64 (x86-64)",
  ARM = "ARM",
}

export enum UpdateStatus {
  CURRENT = "Актуально",
  AVAILABLE = "Доступно",
  ARCHIVE = "Архив",
}

export type PackageSecurityOptions = {
  shouldEncrypt: boolean;
  shouldSign: boolean;
  shouldHash: boolean;
};

export type UpdateVersion = {
  id: string;
  softwareType: ClientSoftwareType;
  name: string;
  version: string;
  packageType: PackageType;
  architecture: Architecture;
  releaseDate: string;
  status: UpdateStatus;
  isCurrent: boolean;
  descriptionFile?: string;
  packageFile?: string;
  security: PackageSecurityOptions;
};

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
