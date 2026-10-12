import { EventType } from "@/generated/prisma/enums";

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  game: "試合",
  practice: "練習",
};

// URL クエリなど外部入力を EventType に変換する（不正な値は undefined = 絞り込みなし）
export const parseEventType = (value?: string): EventType | undefined => {
  return Object.values(EventType).find((type) => type === value);
};
