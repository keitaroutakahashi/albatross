import type { EventStatus } from "@/generated/prisma/enums";

const statusTextMap: Record<EventStatus, string> = {
  scheduled: "練習予定",
  completed: "練習終了",
  canceled: "中止",
};

export const getPracticeStatusText = (status: EventStatus): string => {
  return statusTextMap[status];
};
