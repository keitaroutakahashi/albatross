"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  PROGRESS_FINISH_EVENT,
  PROGRESS_START_EVENT,
} from "@/app/_components/ui/navigation-progress/events";
import { shouldStartProgress } from "@/app/_components/ui/navigation-progress/should-start-progress";
import { cn } from "@/lib/utils";

/** 速く終わる遷移ではバーを出さない（一瞬だけ光るのを避ける） */
const SHOW_DELAY_MS = 150;
const TRICKLE_INTERVAL_MS = 200;
const COMPLETE_HOLD_MS = 150;
const FADE_MS = 250;
/** 遷移が終わったことを検知できなかったときの保険 */
const GIVE_UP_MS = 15_000;
const TRICKLE_LIMIT = 90;

type Timers = {
  show?: ReturnType<typeof setTimeout>;
  trickle?: ReturnType<typeof setInterval>;
  giveUp?: ReturnType<typeof setTimeout>;
  hide?: ReturnType<typeof setTimeout>;
  reset?: ReturnType<typeof setTimeout>;
};

/**
 * ページ遷移中に、画面上部へ細い進捗バーを出す。
 * App Router には遷移の開始を知らせるイベントがないため、next/link のクリックで開始し、
 * URL（パスとクエリ）が変わったときに完了とする。リンク以外の待ち時間は、
 * useNavigationProgressWhile（events.ts 経由）で開始・終了を知らせる。
 * 進捗は実際の読み込み量ではなく、90% までゆっくり進める見せかけ。
 */
export const NavigationProgress = () => {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const active = useRef(false);
  const shown = useRef(false);
  const timers = useRef<Timers>({});

  const clearTimers = useCallback(() => {
    const t = timers.current;
    clearTimeout(t.show);
    clearInterval(t.trickle);
    clearTimeout(t.giveUp);
    clearTimeout(t.hide);
    clearTimeout(t.reset);
    timers.current = {};
  }, []);

  const finish = useCallback(() => {
    if (!active.current) return;
    active.current = false;

    const t = timers.current;
    clearTimeout(t.show);
    clearInterval(t.trickle);
    clearTimeout(t.giveUp);
    // 遅延の間に終わった遷移は、バーを出さずに済ませる
    if (!shown.current) return;

    shown.current = false;
    setProgress(100);
    t.hide = setTimeout(() => {
      setVisible(false);
      t.reset = setTimeout(() => setProgress(0), FADE_MS);
    }, COMPLETE_HOLD_MS);
  }, []);

  const start = useCallback(() => {
    if (active.current) return;
    clearTimers();
    active.current = true;
    shown.current = false;
    setVisible(false);
    setProgress(0);

    const t = timers.current;
    t.show = setTimeout(() => {
      shown.current = true;
      setProgress(15);
      setVisible(true);
      t.trickle = setInterval(() => {
        setProgress((p) => p + (TRICKLE_LIMIT - p) * 0.12);
      }, TRICKLE_INTERVAL_MS);
    }, SHOW_DELAY_MS);
    t.giveUp = setTimeout(finish, GIVE_UP_MS);
  }, [clearTimers, finish]);

  // URL が変わったら、遷移が終わったとみなす
  // biome-ignore lint/correctness/useExhaustiveDependencies: URL の変化そのものを契機にする
  useEffect(() => {
    finish();
  }, [pathname, search, finish]);

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
        className="h-full origin-left bg-secondary transition-transform duration-200 ease-out motion-reduce:transition-none"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  );
};
