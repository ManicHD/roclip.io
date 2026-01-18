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
    default: "BloxClips",
    template: "%s | BloxClips"
  },
  description: "BloxClips connects Roblox content creators with game developers. Create Roblox clips, promote games, and earn money. The #1 platform for Roblox clipping, video marketing, and creator payouts. Join thousands of Roblox creators earning with BloxClips.",
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
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/logo.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bloxclips.com",
    siteName: "BloxClips",
    title: "BloxClips - Earn Money Making Roblox Videos",
    description: "Connect with Roblox game developers, create clips, and earn money. The #1 Roblox clipping and creator platform.",
    images: [
      {
        url: "/og-banner.png",
        width: 1200,
        height: 630,
        alt: "BloxClips - Roblox Clipping Platform",
      },
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "BloxClips Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BloxClips - Earn Money Making Roblox Videos",
    description: "Create Roblox clips, promote games, earn money. Join the #1 Roblox clipping platform.",
    images: ["/og-banner.png"],
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
