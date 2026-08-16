import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import { site } from "@/data/site";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Cursor } from "@/components/cursor";
import "./globals.css";

const display = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const sans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-face",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.positioning,
  keywords: [
    "Suyog Bhoye",
    "software developer",
    "Flutter developer",
    "Pune",
    "Next.js",
    "Golang",
    "portfolio",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.positioning,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: site.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.positioning,
    images: ["/og.png"],
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
    { media: "(prefers-color-scheme: light)", color: "#f7f6f3" },
  ],
};

// Runs before paint so the theme never flashes. Dark is the default.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||(!t&&window.matchMedia("(prefers-color-scheme: light)").matches)){document.documentElement.classList.add("light")}}catch(e){}})();`;

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  email: `mailto:${site.email}`,
  jobTitle: "Software Developer",
  description: site.positioning,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Pune",
    addressRegion: "Maharashtra",
    addressCountry: "IN",
  },
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "Vishwakarma Institute of Information Technology, Pune",
    },
    { "@type": "EducationalOrganization", name: "Government Polytechnic, Nashik" },
  ],
  knowsAbout: [
    "Flutter",
    "Dart",
    "Go",
    "TypeScript",
    "Next.js",
    "Firebase",
    "PostgreSQL",
    "System design",
  ],
  sameAs: [site.github, site.linkedin],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // Font variables go on <html>: the theme tokens that reference them are
    // declared on :root, and a var() chain only resolves where it is declared.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-none focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:text-accent-ink"
        >
          Skip to content
        </a>
        <Cursor />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
