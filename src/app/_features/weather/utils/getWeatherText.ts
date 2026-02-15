import type { Weather } from "@/generated/prisma/enums";

const weatherTextMap: Record<Weather, string> = {
  sunny: "晴れ",
  cloudy: "曇り",
  rainy: "雨",
  snowy: "雪",
};

export const getWeatherText = (
  weather: Weather | undefined,
): string => {
  if (!weather) return "";
  return weatherTextMap[weather];
};
