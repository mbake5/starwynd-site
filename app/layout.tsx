import "./globals.css";

export const metadata = {
  title: "Starwynd | Cinematic Electronic Music",
  description: "Official Starwynd website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}