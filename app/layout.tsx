import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.starwyndmusic.com"),

  title: {
    default: "Starwynd | Cinematic Electronic Music",
    template: "%s | Starwynd",
  },

  description:
    "Starwynd creates cinematic, atmospheric electronic music rooted in emotional storytelling, human production, and immersive soundscapes.",

  keywords: [
    "Starwynd",
    "electronic music",
    "cinematic music",
    "atmospheric music",
    "synth pop",
    "ambient electronic",
    "independent music",
  ],

  alternates: {
    canonical: "https://www.starwyndmusic.com",
  },

  openGraph: {
    title: "Starwynd | Cinematic Electronic Music",
    description:
      "Cinematic, atmospheric electronic music rooted in emotional storytelling and human production.",
    url: "https://www.starwyndmusic.com",
    siteName: "Starwynd",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/banner.webp",
        width: 1200,
        height: 750,
        alt: "Starwynd",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Starwynd | Cinematic Electronic Music",
    description:
      "Cinematic, atmospheric electronic music rooted in emotional storytelling and human production.",
    images: ["/images/banner.webp"],
  },

  icons: {
    icon: "/favicon.ico",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: "Starwynd",
    url: "https://www.starwyndmusic.com",
    genre: ["Atmospheric Pop", "Electronic", "Cinematic"],
    sameAs: [
      "https://open.spotify.com/artist/5qyoyaRsxcHKln2TxqoUgL",
      "https://www.youtube.com/channel/UCGNTkRr6hq3KRmKNvrSVxBg",
      "https://ko-fi.com/starwynd",
    ],
  };

  return (
    <html lang="en">
      <body>
        {children}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        <Analytics />
      </body>
    </html>
  );
}