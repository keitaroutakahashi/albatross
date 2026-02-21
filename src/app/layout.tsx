import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@/app/globals.css";
import clsx from "clsx";
import { Footer } from "@/app/_components/ui/footer";
import { Header } from "@/app/_components/ui/header";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  description: "",
  title: {
    template: "%s | Albatross",
    default: "Albatross",
  },
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja">
      <body
        style={{
          fontFamily:
            '"Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Noto Sans JP", sans-serif',
          textAutospace: "normal",
          lineBreak: "strict",
        }}
        className={clsx(
          roboto.variable,
          "antialiased",
          "text-black",
          "wrap-anywhere",
          "break-normal",
        )}
      >
        <div className="@container max-w-3xl mx-auto">
          <Header />
          <div className="min-h-[calc(100vh-var(--size-header-height)-var(--size-footer-height))]">
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
