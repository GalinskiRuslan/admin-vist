// src/app/details/[appName]/[os]/[version]/page.tsx
"use client";

import { UpdateDetailsView } from "@/app/components/UpdateVersionDetailsView";
import { OS } from "@/app/services/updateService";
import { useParams, useRouter } from "next/navigation";

export default function DetailsPage() {
  const params = useParams<{
    appName: string;
    os: string;
    version: string;
  }>();
  const router = useRouter();

  const appName = params.appName;
  const os = params.os as OS;
  const version = Number(params.version);

  return (
    <UpdateDetailsView
      appName={appName}
      os={os}
      version={version}
      onBack={() => router.push("/")}
    />
  );
}
