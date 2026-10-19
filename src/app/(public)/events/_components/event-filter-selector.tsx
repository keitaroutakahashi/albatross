"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/shadcn/select";
import { useNavigationProgressWhile } from "@/app/_components/ui/navigation-progress/use-navigation-progress-while";
import {
  EVENT_TYPE_LABELS,
  parseEventType,
} from "@/app/_features/events/utils/event-type";
import { formatSeason } from "@/app/_utils/season";
import { EventType } from "@/generated/prisma/enums";
import type { SeasonModel } from "@/generated/prisma/models/Season";

type Props = {
  seasons: SeasonModel[];
  defaultSeason: string;
};

// 種別の「すべて」は type クエリなしで表現する
const ALL_TYPES = "all";

export function EventFilterSelector({ seasons, defaultSeason }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  useNavigationProgressWhile(isPending);

  const currentSeason = searchParams.get("season") ?? String(defaultSeason);
  const currentType =
    parseEventType(searchParams.get("type") ?? undefined) ?? ALL_TYPES;

  const updateParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    startTransition(() => {
      router.push(`/events?${params.toString()}`);
    });
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Select
          value={currentSeason}
          onValueChange={(season) => updateParams("season", season)}
        >
          <SelectTrigger className="w-45" aria-label="年度">
            <SelectValue placeholder="年度を選択" />
          </SelectTrigger>
          <SelectContent>
            {seasons.map((season) => (
              <SelectItem key={season.id} value={String(season.season)}>
                {formatSeason(season.season)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Select
        value={currentType}
        onValueChange={(type) =>
          updateParams("type", type === ALL_TYPES ? null : type)
        }
      >
        <SelectTrigger className="w-30" aria-label="種別">
          <SelectValue placeholder="種別を選択" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_TYPES}>すべて</SelectItem>
          {Object.values(EventType).map((type) => (
            <SelectItem key={type} value={type}>
              {EVENT_TYPE_LABELS[type]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
