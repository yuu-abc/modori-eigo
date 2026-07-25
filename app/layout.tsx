import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "もどり英語 | 休んでも、また戻れる英語学習",
  description: "気分に合わせて小さく始め、休んでもまた戻れる英検2級学習アプリ。",
  manifest: "/manifest.webmanifest",
  applicationName: "もどり英語",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "もどり英語",
  },
  icons: {
    icon: [
      { url: "/app-icon.svg", type: "image/svg+xml", sizes: "any" },
      { url: "/app-icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/app-icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/app-icon-192.png", type: "image/png", sizes: "192x192" }],
  },
  openGraph: {
    title: "もどり英語",
    description: "できる日に、できるぶんだけ。休んでも、また戻れば大丈夫。",
    type: "website",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "もどり英語" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "もどり英語",
    description: "できる日に、できるぶんだけ。休んでも、また戻れば大丈夫。",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
