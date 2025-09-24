import type { Metadata } from "next";
import { Brand } from "@/components/Brand";
import { CTASticky } from "@/components/CTASticky";
import { AuthButtons } from "@/components/AuthButtons";
import { sv } from "@/lib/i18n/sv";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chart2signals.vercel.app";

export const metadata: Metadata = {
  title: {
    default: sv.brand,
    template: `%s | ${sv.brand}`,
  },
  description:
    "Automatisera din tekniska analys med Chart2Signals by BetSpread. Ladda upp en graf och få färdiga köp-/sälj-signaler på svenska.",
  alternates: { canonical: siteUrl },
  openGraph: {
    title: sv.brand,
    description:
      "Automatisera din tekniska analys med AI och heuristik. Ladda upp valfri aktie-, krypto- eller forex-graf.",
    url: siteUrl,
    siteName: sv.brand,
    locale: "sv_SE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: sv.brand,
    description: "AI och tekniska indikatorer som genererar tydliga handels-signaler.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: sv.brand,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "499",
      priceCurrency: "SEK",
    },
    description:
      "Chart2Signals extraherar data från prisgrafer och producerar köp- och säljsignaler med tydlig riskhantering.",
    url: siteUrl,
  };

  return (
    <html lang="sv">
      <body className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
        <div className="relative flex min-h-screen flex-col pb-16">
          <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
              <Brand />
              {/* @ts-expect-error Async Server Component */}
              <AuthButtons />
            </div>
          </header>
          <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-10">{children}</main>
          <footer className="mx-auto w-full max-w-5xl px-4 py-10 text-sm text-slate-500">
            <p>
              © {new Date().getFullYear()} {sv.brand}. Kontakta oss på <a href={`mailto:${sv.contact}`}>{sv.contact}</a>.
            </p>
          </footer>
        </div>
        <CTASticky />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
