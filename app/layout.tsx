import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BloxClips - roblox clipping",
    template: "%s | BloxClips"
  },
  description: "The #1 Roblox clipping and creator platform.",
  keywords: [
    "roblox clipping",
    "clip roblox",
    "roblox clips",
    "roblox video",
    "roblox content creator",
    "roblox marketing",
    "roblox promotion",
    "roblox game promotion",
    "earn money roblox",
    "roblox creator",
    "roblox ugc",
    "bloxclips",
    "blox clips",
    "roblox youtube",
    "roblox tiktok",
    "roblox influencer",
    "roblox shorts",
    "roblox video editing",
    "get paid to play roblox",
    "roblox sponsor",
    "roblox campaign",
    "roblox advertising"
  ],
  authors: [{ name: "BloxClips Marketing LLC" }],
  creator: "BloxClips Marketing LLC",
  publisher: "BloxClips Marketing LLC",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.png", // Explicit path for search engines
    shortcut: "/favicon.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bloxclips.com",
    siteName: "BloxClips",
    title: "BloxClips - roblox clipping",
    description: "The #1 Roblox clipping and creator platform.",
    images: [
      {
        url: "/og-banner.jpg",
        width: 1200,
        height: 630,
        alt: "BloxClips - Clip Roblox Games",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BloxClips - roblox clipping",
    description: "The #1 Roblox clipping and creator platform.",
    images: ["/og-banner.jpg"],
    creator: "@BloxClips",
  },
  alternates: {
    canonical: "https://bloxclips.com",
  },
  category: "Gaming",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} antialiased`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
