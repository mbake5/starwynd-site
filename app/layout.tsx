import type { Metadata } from "next";
import localFont from "next/font/local";
import "./base.css";
import { Analytics } from "@vercel/analytics/next";

const displayFont = localFont({
  src: [
    { path: "./fonts/space-grotesk-500.ttf", weight: "500", style: "normal" },
    { path: "./fonts/space-grotesk-600.ttf", weight: "600", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.starwyndmusic.com"),

  title: {
    default: "Starwynd | Atmospheric Synthpop",
    template: "%s | Starwynd",
  },

  description:
    "Starwynd is a synthpop music group blending cinematic atmosphere, luminous synths, and emotional storytelling.",

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

  // Share image and icons come from app/opengraph-image.jpg, favicon.ico,
  // icon.png and apple-icon.png, which Next.js sizes and links automatically.
  openGraph: {
    title: "Starwynd | Atmospheric Synthpop",
    description:
      "Atmospheric synthpop, cinematic production, and emotional storytelling from Starwynd.",
    url: "https://www.starwyndmusic.com",
    siteName: "Starwynd",
    type: "website",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Starwynd | Atmospheric Synthpop",
    description:
      "Atmospheric synthpop, cinematic production, and emotional storytelling from Starwynd.",
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
    image: "https://www.starwyndmusic.com/opengraph-image.jpg",
    genre: ["Synthpop", "Electronic", "Cinematic"],
    sameAs: [
      "https://open.spotify.com/artist/5qyoyaRsxcHKln2TxqoUgL",
      "https://music.apple.com/us/artist/starwynd/1841275156",
      "https://music.amazon.com/artists/B0FS12VR2X/starwynd",
      "https://www.youtube.com/channel/UCpCI4H8FllHtTgq3MDB9Y5w",
      "https://ko-fi.com/starwynd",
    ],
  };

  return (
    <html lang="en" className={displayFont.variable}>
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
