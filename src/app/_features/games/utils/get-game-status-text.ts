import type { EventStatus } from "@/generated/prisma/enums";

const statusTextMap: Record<EventStatus, string> = {
  scheduled: "試合予定",
  completed: "試合終了",
  canceled: "中止",
};

export const getGameStatusText = (status: EventStatus): string => {
  return statusTextMap[status];
};
