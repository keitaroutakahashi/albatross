"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  PROGRESS_FINISH_EVENT,
  PROGRESS_START_EVENT,
} from "@/app/_components/ui/navigation-progress/events";
import { shouldStartProgress } from "@/app/_components/ui/navigation-progress/should-start-progress";
import { cn } from "@/lib/utils";

/** 速く終わる遷移でも、バーが見えるように最低限の時間は出す */
const MIN_VISIBLE_MS = 400;
const TRICKLE_INTERVAL_MS = 200;
const COMPLETE_HOLD_MS = 150;
const FADE_MS = 250;
/** 遷移が終わったことを検知できなかったときの保険 */
const GIVE_UP_MS = 15_000;
const TRICKLE_LIMIT = 90;
const START_PROGRESS = 15;

type Timers = {
  trickle?: ReturnType<typeof setInterval>;
  giveUp?: ReturnType<typeof setTimeout>;
  complete?: ReturnType<typeof setTimeout>;
  hide?: ReturnType<typeof setTimeout>;
  reset?: ReturnType<typeof setTimeout>;
};

/** 読み込み中のスケルトン（LoadingStatus が aria-busy を付ける）が画面に残っているか */
const isContentLoading = () =>
  document.querySelector('[aria-busy="true"]') !== null;

/**
 * ページ遷移中に、画面上部へ細い進捗バーを出す。
 *
 * - 開始: next/link のクリック（App Router には遷移の開始を知らせるイベントがない）。
 *   リンク以外の待ち時間は、useNavigationProgressWhile（events.ts 経由）で開始・終了を知らせる。
 * - 完了: URL（パスとクエリ）が変わったとき。ただし loading.tsx があるページは、URL が変わると
 *   すぐスケルトンに切り替わり、データはその裏で読み込まれ続けるため、スケルトン
 *   （aria-busy="true"）が消えるまでバーを続ける。
 * - 進捗は実際の読み込み量ではなく、90% までゆっくり進める見せかけ。
 */
export const NavigationProgress = () => {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  // 新しく始めるたびに、バーを 0 から描き直す（前回の 100% から縮んで見えないようにする）
  const [run, setRun] = useState(0);
  const active = useRef(false);
  const startedAt = useRef(0);
  const timers = useRef<Timers>({});
  const observer = useRef<MutationObserver | null>(null);

  const stopObserving = useCallback(() => {
    observer.current?.disconnect();
    observer.current = null;
  }, []);

  const clearTimers = useCallback(() => {
    const t = timers.current;
    clearInterval(t.trickle);
    clearTimeout(t.giveUp);
    clearTimeout(t.complete);
    clearTimeout(t.hide);
    clearTimeout(t.reset);
    timers.current = {};
    stopObserving();
  }, [stopObserving]);

  const finish = useCallback(() => {
    if (!active.current) return;
    active.current = false;

    const t = timers.current;
    clearInterval(t.trickle);
    clearTimeout(t.giveUp);
    stopObserving();

    const wait = Math.max(0, MIN_VISIBLE_MS - (Date.now() - startedAt.current));
    t.complete = setTimeout(() => {
      setProgress(100);
      t.hide = setTimeout(() => {
        setVisible(false);
        t.reset = setTimeout(() => setProgress(0), FADE_MS);
      }, COMPLETE_HOLD_MS);
    }, wait);
  }, [stopObserving]);

  const start = useCallback(() => {
    if (active.current) return;
    clearTimers();
    active.current = true;
    startedAt.current = Date.now();
    setRun((n) => n + 1);
    setProgress(START_PROGRESS);
    setVisible(true);

    const t = timers.current;
    t.trickle = setInterval(() => {
      setProgress((p) => p + (TRICKLE_LIMIT - p) * 0.12);
    }, TRICKLE_INTERVAL_MS);
    t.giveUp = setTimeout(finish, GIVE_UP_MS);
  }, [clearTimers, finish]);

  /** URL が変わったあと、読み込み中の表示が消えるのを待ってから完了にする */
  const settle = useCallback(() => {
    if (!active.current) return;
    if (!isContentLoading()) {
      finish();
      return;
    }

    stopObserving();
    const watcher = new MutationObserver(() => {
      if (isContentLoading()) return;
      finish();
    });
    watcher.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["aria-busy"],
    });
    observer.current = watcher;
  }, [finish, stopObserving]);

  // URL が変わったら、遷移先の画面に切り替わったとみなす
  // biome-ignore lint/correctness/useExhaustiveDependencies: URL の変化そのものを契機にする
  useEffect(() => {
    settle();
  }, [pathname, search, settle]);

  useEffect(() => {
    // バブリング段階で受ける。Link はクライアント遷移のとき、先に preventDefault を呼んでいる
    const onClick = (event: MouseEvent) => {
      const anchor =
        event.target instanceof Element ? event.target.closest("a") : null;
      const shouldStart = shouldStartProgress({
        defaultPrevented: event.defaultPrevented,
        button: event.button,
        hasModifier:
          event.metaKey || event.ctrlKey || event.shiftKey || event.altKey,
        target: anchor?.getAttribute("target") ?? null,
        isDownload: anchor?.hasAttribute("download") ?? false,
        href: anchor?.href ?? null,
        currentUrl: window.location.href,
      });
      if (shouldStart) start();
    };

    document.addEventListener("click", onClick);
    // リンク以外（router.push・フォーム送信・フィルターの読み込みなど）からの開始・終了
    window.addEventListener(PROGRESS_START_EVENT, start);
    window.addEventListener(PROGRESS_FINISH_EVENT, finish);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener(PROGRESS_START_EVENT, start);
      window.removeEventListener(PROGRESS_FINISH_EVENT, finish);
      clearTimers();
    };
  }, [start, finish, clearTimers]);

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 transition-opacity duration-200 motion-reduce:transition-none",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      <div
        key={run}
        className="h-full origin-left bg-secondary transition-transform duration-200 ease-out motion-reduce:transition-none"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  );
};
