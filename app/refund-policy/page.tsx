import { notFound } from "next/navigation";
import { LegalPage } from "@/components/LegalPage";
import { getLegalDocument } from "@/lib/legal-content";

export const metadata = {
  title: "Refund Policy | The Alkebula School",
  description: "How cancellations, rescheduling, credits, and refunds are handled.",
};

export default function Page() {
  const document = getLegalDocument("refund-policy");
  if (!document) notFound();

  return <LegalPage document={document} />;
}
