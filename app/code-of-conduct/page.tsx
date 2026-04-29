import { notFound } from "next/navigation";
import { LegalPage } from "@/components/LegalPage";
import { getLegalDocument } from "@/lib/legal-content";

export const metadata = {
  title: "Code of Conduct | The Alkebula School",
  description: "The standards of behaviour expected from all users of The Alkebula School.",
};

export default function Page() {
  const document = getLegalDocument("code-of-conduct");
  if (!document) notFound();

  return <LegalPage document={document} />;
}
