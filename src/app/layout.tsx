import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@/app/globals.css";
import clsx from "clsx";
import { Suspense } from "react";
import { NavigationProgress } from "@/app/_components/ui/navigation-progress";
import { ScrollToTop } from "@/app/_components/ui/scroll-to-top";

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
    // Google Tag Assistant などの拡張機能が、React の起動前に html へ属性を足すため警告を抑止する
    <html lang="ja" suppressHydrationWarning>
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
        {/* useSearchParams を使うため、静的なページの生成を妨げないよう Suspense で囲む */}
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
}
