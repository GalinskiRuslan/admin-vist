"use client";

import { useRouter } from "next/navigation";
import { AdminLayout } from "../components/AdminLayout";
import { AddUpdateVersionView } from "../components/AddUpdateVersionView";

export default function AddUpdatePage() {
  const router = useRouter();

  return (
    <AdminLayout>
      <AddUpdateVersionView
        onBack={() => {
          router.push("/");
        }}
      />
    </AdminLayout>
  );
}
