"use client";

import { useRouter } from "next/navigation";
import { AdminLayout } from "../../components/AdminLayout";
import { UpdateVersionDetailsView } from "../../components/UpdateVersionDetailsView";
import { UpdateVersion } from "../../types";

type UpdateVersionDetailsPageViewProps = {
  version: UpdateVersion;
};

export const UpdateVersionDetailsPageView = ({
  version,
}: UpdateVersionDetailsPageViewProps) => {
  const router = useRouter();

  return (
    <AdminLayout>
      <UpdateVersionDetailsView
        version={version}
        onClose={() => {
          router.push("/");
        }}
      />
    </AdminLayout>
  );
};
