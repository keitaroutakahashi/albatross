import type { GameStatus } from "@/generated/prisma/enums";

const statusTextMap: Record<GameStatus, string> = {
  scheduled: "試合予定",
  completed: "試合終了",
  canceled: "中止",
};

export const getGameStatusText = (status: GameStatus): string => {
  return statusTextMap[status];
};
