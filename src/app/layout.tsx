import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { Footer } from "@/app/_components/footer";
import { Header } from "@/app/_components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Albatross",
  description: "",
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-black`}
      >
        <Header />
        <div className="min-h-[calc(100vh-var(--size-header-height)-var(--size-footer-height))]">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
