"use client";

import { useRouter } from "next/navigation";
import { AdminLayout } from "../../../../components/AdminLayout";
import { UpdateVersion } from "../../../../types";

type UpdateVersionDetailsPageViewProps = {
  version: UpdateVersion;
};

export const UpdateVersionDetailsPageView = ({
  version,
}: UpdateVersionDetailsPageViewProps) => {
  const router = useRouter();

  return (
    <AdminLayout>
      <UpdateVersionDetailsPageView version={version} />
    </AdminLayout>
  );
};
