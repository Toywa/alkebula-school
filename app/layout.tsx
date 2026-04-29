import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LiveChat from "@/components/LiveChat";

export const metadata: Metadata = {
  title: "The Alkebula School",
  description:
    "A premium education system built to close learning gaps, strengthen mastery, and help students move forward with confidence, structure, and measurable academic progress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900">
        <Header />
        {children}
        <Footer />
        <LiveChat />
      </body>
    </html>
  );
}