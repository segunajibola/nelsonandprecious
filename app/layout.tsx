import type { Metadata, Viewport } from "next";
import { Playfair_Display, Jost } from "next/font/google";
import { ThemeProvider, themeInitScript } from "@/components/layout/ThemeProvider";
import { couple } from "@/lib/data";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
});

const siteTitle = `${couple.brideName} & ${couple.groomName} | ${couple.weddingDateDisplay}`;
const siteDescription = `Join ${couple.brideName} and ${couple.groomName} as they celebrate their wedding on ${couple.weddingDateDisplay}. Find our story, wedding details, and RSVP here.`;

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    images: [{ url: couple.heroImage, width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [couple.heroImage],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdf6f0" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1626" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jost.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
