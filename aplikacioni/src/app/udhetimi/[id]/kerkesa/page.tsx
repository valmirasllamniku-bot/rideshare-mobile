import { redirect } from "next/navigation";

export default async function KerkesaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/projekti/${id}/kerkesa`);
}
