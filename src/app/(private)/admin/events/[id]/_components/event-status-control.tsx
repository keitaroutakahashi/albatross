"use client";

import { useState, useTransition } from "react";
import { Spinner } from "@/app/_components/ui/spinner";
import { eventStatusLabel } from "@/app/_constants/labels";
import { updateEventStatus } from "@/app/(private)/admin/_actions/event";
import type { EventStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

type Props = {
  eventId: number;
  status: EventStatus;
};

const STATUSES: EventStatus[] = ["scheduled", "completed", "canceled"];

/** 一覧の状態バッジと同じ色。紺・金はブランドカラーのため使わない */
const selectedClass: Record<EventStatus, string> = {
  scheduled: "border-sky-300 bg-sky-100 text-sky-700",
  completed: "border-emerald-300 bg-emerald-100 text-emerald-700",
  canceled: "border-destructive/40 bg-destructive/10 text-destructive",
};

/** 状態をタップで切り替える。選ぶとすぐに保存する */
export const EventStatusControl = ({ eventId, status }: Props) => {
  const [current, setCurrent] = useState(status);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  const change = (next: EventStatus) => {
    if (next === current) return;
    const previous = current;
    setCurrent(next);
    setError(undefined);
    startTransition(async () => {
      const result = await updateEventStatus(eventId, next);
      if (result.message) {
        setCurrent(previous);
        setError(result.message);
      }
    });
  };

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-sm font-medium">状態</legend>
      <div className="grid grid-cols-3 gap-2">
        {STATUSES.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={current === value}
            disabled={pending}
            onClick={() => change(value)}
            className={cn(
              "h-11 rounded-md border text-sm font-bold transition-colors disabled:opacity-60",
              current === value
                ? selectedClass[value]
                : "bg-background text-muted-foreground hover:bg-accent",
            )}
          >
            <span className="inline-flex items-center justify-center gap-1.5">
              {pending && current === value && <Spinner className="size-4" />}
              {eventStatusLabel[value]}
            </span>
          </button>
        ))}
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </fieldset>
  );
};
