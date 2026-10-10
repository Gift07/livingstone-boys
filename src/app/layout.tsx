import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { school } from "@/lib/school";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: school.name,
    template: `%s | ${school.name}`,
  },
  description: `${school.name} — ${school.type}. ${school.motto}.`,
  icons: { icon: school.logo },
  formatDetection: {
    telephone: false,
    date: false,
    email: false,
    address: false,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full bg-white text-[#1a1a1a] antialiased`}
    >
      <body className="min-h-full bg-white font-sans text-[#1a1a1a]">
        {children}
      </body>
    </html>
  );
}
