"use client";

import { useEffect, useState } from "react";

type Props = {
  /** 試合開始日時（ISO 文字列） */
  targetDate: string;
};

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type Segment = {
  label: string;
  value: string;
};

const padZero = (value: number) => String(value).padStart(2, "0");

const toRemaining = (remainingMs: number): Remaining => {
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));

  return {
    days: Math.floor(totalSeconds / (24 * 60 * 60)),
    hours: Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60)),
    minutes: Math.floor((totalSeconds % (60 * 60)) / 60),
    seconds: totalSeconds % 60,
  };
};

/** 日/時/分/秒 の 4 列を返す */
const toSegments = (remaining: Remaining | null): Segment[] => {
  if (!remaining) {
    return [
      { label: "DAY", value: "--" },
      { label: "HOUR", value: "--" },
      { label: "MIN", value: "--" },
      { label: "SEC", value: "--" },
    ];
  }

  return [
    { label: "DAY", value: padZero(remaining.days) },
    { label: "HOUR", value: padZero(remaining.hours) },
    { label: "MIN", value: padZero(remaining.minutes) },
    { label: "SEC", value: padZero(remaining.seconds) },
  ];
};

/**
 * 試合開始までの残り時間をカウントダウン表示する。
 * SP・PC ともにラベル付きの 4 列（日/時/分/秒）で表示する。
 */
export const GameCountdown = ({ targetDate }: Props) => {
  // サーバーとクライアントで時刻がずれハイドレーションが崩れるため、
  // マウント後に初めて残り時間を描画する
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const update = () => {
      setRemaining(toRemaining(target - Date.now()));
    };

    update();
    const intervalId = setInterval(update, 1000);

    return () => clearInterval(intervalId);
  }, [targetDate]);

  return (
    <div className="grid grid-cols-4 gap-x-4 font-(family-name:--font-roboto) tabular-nums">
      {toSegments(remaining).map((segment) => (
        <div key={segment.label} className="flex flex-col items-center">
          <span className="text-xl font-bold leading-tight">
            {segment.value}
          </span>
          <span className="text-xxs tracking-widest text-white/60">
            {segment.label}
          </span>
        </div>
      ))}
    </div>
  );
};
