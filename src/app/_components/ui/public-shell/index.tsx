import type { ReactNode } from "react";
import { Footer } from "@/app/_components/ui/footer";
import { Header } from "@/app/_components/ui/header";

type Props = {
  children: ReactNode;
};

/**
 * 公開ページ共通の枠（ヘッダー・最大幅コンテナ・フッター）。
 * 管理画面は独自の枠を持つため、root layout ではなくここで適用する。
 */
export const PublicShell = ({ children }: Props) => {
  return (
    <>
      {/* Header は fixed のため、@container（レイアウト封じ込めが効き fixed の
          基準要素になってしまう）の外に置く */}
      <Header />
      <div className="@container max-w-3xl mx-auto pt-(--size-header-height)">
        <div className="min-h-[calc(100dvh-var(--size-header-height)-var(--size-footer-height))]">
          {children}
        </div>
        <Footer />
      </div>
    </>
  );
};
