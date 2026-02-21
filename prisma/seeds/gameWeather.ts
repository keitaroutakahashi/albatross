import type { Weather } from "../../src/generated/prisma/client.js";

// 試合ごとの天候データ
type GameWeatherInput = {
  gameId: number;
  weather: Weather;
  temperature: number;
};

export function getGameWeathers(gameIds: number[]): GameWeatherInput[] {
  return [
    // 試合1: 2024-04-14（4月の晴れた日）
    {
      gameId: gameIds[0],
      weather: "sunny",
      temperature: 18.5,
    },
    // 試合2: 2024-05-11（5月の曇りの日）
    {
      gameId: gameIds[1],
      weather: "cloudy",
      temperature: 22.0,
    },
    // 試合3: 2024-06-05（6月の雨の日）
    {
      gameId: gameIds[2],
      weather: "rainy",
      temperature: 19.5,
    },
    // 試合5: 2025-03-16（雨天中止）
    {
      gameId: gameIds[4],
      weather: "rainy",
      temperature: 8.0,
    },
  ];
}
