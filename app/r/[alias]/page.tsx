import { notFound, redirect } from "next/navigation";
import { findLink } from "@/lib/links";

export const dynamic = "force-dynamic";

export default async function AliasPage({ params }: { params: Promise<{ alias: string }> }) {
  const { alias } = await params;
  const link = await findLink(alias);
  if (!link) {
    notFound();
  }
  redirect(link.url);
}
