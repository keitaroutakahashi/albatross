"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * ページ遷移後に、画面の一番上から表示する。
 *
 * App Router は遷移先の先頭が画面外のときしかスクロールを戻さないため、
 * 固定ヘッダーや loading.tsx のスケルトンがあると途中の位置から表示されることがある。
 * クエリだけの変更（フィルターなど）と、戻る・進むによる位置の復元は対象外にする。
 */
export const ScrollToTop = () => {
  const pathname = usePathname();
  const previous = useRef(pathname);
  const isHistoryNavigation = useRef(false);

  useEffect(() => {
    const onPopState = () => {
      isHistoryNavigation.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;

    if (isHistoryNavigation.current) {
      isHistoryNavigation.current = false;
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
};
