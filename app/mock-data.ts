import {
  Architecture,
  ClientSoftwareType,
  PackageType,
  UpdateStatus,
  UpdateVersion,
} from "./types";

export const MOCK_UPDATES: UpdateVersion[] = [
  {
    id: "1",
    softwareType: ClientSoftwareType.FEX,
    name: "FEX Desktop",
    version: "2.3.1",
    packageType: PackageType.MSI,
    architecture: Architecture.AMD64,
    releaseDate: "2024-03-21",
    status: UpdateStatus.CURRENT,
    isCurrent: true,
    descriptionFile: "fex-desktop-2.3.1.json",
    packageFile: "fex-desktop-2.3.1.msi",
    security: {
      shouldEncrypt: false,
      shouldHash: true,
      shouldSign: true,
    },
  },
  {
    id: "2",
    softwareType: ClientSoftwareType.MAIL,
    name: "MailPro",
    version: "5.0.0",
    packageType: PackageType.DEB,
    architecture: Architecture.AMD64,
    releaseDate: "2024-02-14",
    status: UpdateStatus.AVAILABLE,
    isCurrent: false,
    descriptionFile: "mailpro-5.0.0.json",
    packageFile: "mailpro-5.0.0.deb",
    security: {
      shouldEncrypt: true,
      shouldHash: true,
      shouldSign: true,
    },
  },
  {
    id: "3",
    softwareType: ClientSoftwareType.IM,
    name: "SecureChat",
    version: "1.8.5",
    packageType: PackageType.RPM,
    architecture: Architecture.ARM,
    releaseDate: "2023-11-08",
    status: UpdateStatus.ARCHIVE,
    isCurrent: false,
    descriptionFile: "securechat-1.8.5.json",
    packageFile: "securechat-1.8.5.rpm",
    security: {
      shouldEncrypt: true,
      shouldHash: true,
      shouldSign: false,
    },
  },
];

export const getMockUpdateById = (id: string): UpdateVersion | undefined =>
  MOCK_UPDATES.find((update) => update.id === id);
