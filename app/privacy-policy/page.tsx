import { notFound } from "next/navigation";
import { LegalPage } from "@/components/LegalPage";
import { getLegalDocument } from "@/lib/legal-content";

export const metadata = {
  title: "Privacy Policy | The Alkebula School",
  description: "How we collect, use, protect, and share personal information.",
};

export default function Page() {
  const document = getLegalDocument("privacy-policy");
  if (!document) notFound();

  return <LegalPage document={document} />;
}
