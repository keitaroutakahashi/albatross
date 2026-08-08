import Link from "next/link";
import { Suspense } from "react";
import { BattingLeaders } from "@/app/(public)/_components/batting-leaders";
import { Hero } from "@/app/(public)/_components/hero";
import { LatestGame } from "@/app/(public)/_components/latest-game";
import { NextGameBar } from "@/app/(public)/_components/next-game-bar";
import { PitchingStats } from "@/app/(public)/_components/pitching-stats";
import { Schedule } from "@/app/(public)/_components/schedule";

export default function Page() {
  return (
    <div className="">
      {/* Hero と NextGameBar を合わせてファーストビューの縦幅いっぱいにする */}
      <div className="flex flex-col h-[calc(100dvh-var(--size-header-height))]">
        <Hero />
        <NextGameBar />
      </div>
      {/* 試合データの取得を待たずに以降を先に描画する。
          終了した試合が無ければ LatestGame は何も描画しないため fallback も置かない */}
      <Suspense fallback={null}>
        <LatestGame />
      </Suspense>
      <Suspense fallback={null}>
        <Schedule />
      </Suspense>
      <Suspense fallback={null}>
        <BattingLeaders />
      </Suspense>
      <Suspense fallback={null}>
        <PitchingStats />
      </Suspense>
    </div>
  );
}
