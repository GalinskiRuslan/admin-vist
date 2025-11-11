import { notFound } from "next/navigation";
import { getMockUpdateById } from "../../mock-data";
import { UpdateVersionDetailsPageView } from "./update-version-details-page-view";

export default function UpdateDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const version = getMockUpdateById(params.id);

  if (!version) {
    notFound();
  }

  return <UpdateVersionDetailsPageView version={version} />;
}
