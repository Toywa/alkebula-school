import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LiveChat from "@/components/LiveChat";

const siteUrl = "https://www.alkebulaschool.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default:
      "The Alkebula School | Online Cambridge, Edexcel, A Level & IB Tutoring",
    template: "%s | The Alkebula School",
  },

  description:
    "The Alkebula School is a premium global online education system for Cambridge IGCSE, Edexcel IGCSE, A Levels, and IB students. We help learners close gaps, strengthen mastery, and make measurable academic progress.",

  keywords: [
    "online Cambridge IGCSE tutors",
    "Edexcel IGCSE online tutoring",
    "A Level online tutors",
    "IB online tutors",
    "international curriculum tutors",
    "online tutoring Kenya",
    "Cambridge IGCSE tutors Nairobi",
    "homeschool support Kenya",
    "online school for homeschooling families",
    "The Alkebula School",
  ],

  authors: [{ name: "The Alkebula School" }],
  creator: "The Alkebula School",
  publisher: "The Alkebula School",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_KE",
    url: siteUrl,
    siteName: "The Alkebula School",
    title:
      "The Alkebula School | Online Cambridge, Edexcel, A Level & IB Tutoring",
    description:
      "Premium online tutoring for Cambridge IGCSE, Edexcel IGCSE, A Levels, and IB learners worldwide.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Alkebula School online international tutoring",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "The Alkebula School | Online Cambridge, Edexcel, A Level & IB Tutoring",
    description:
      "Premium online tutoring for Cambridge IGCSE, Edexcel IGCSE, A Levels, and IB learners worldwide.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
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