import type {
  Position,
  PrismaClient,
} from "../../../src/generated/prisma/client.js";
import type { SeedContext } from "./_shared.js";
import { seedSeason2024 } from "./2024/index.js";
import { seedSeason2025 } from "./2025/index.js";
import { seedSeason2026 } from "./2026/index.js";

export async function seedGames(prisma: PrismaClient) {
  console.log("Seeding games...");

  // マスタデータを取得
  const season2024 = await prisma.season.findUnique({
    where: { season: 2024 },
  });
  const season2025 = await prisma.season.findUnique({
    where: { season: 2025 },
  });
  const season2026 = await prisma.season.findUnique({
    where: { season: 2026 },
  });
  const leagues = await prisma.league.findMany();
  const grounds = await prisma.ground.findMany();
  const opponents = await prisma.opponent.findMany();
  const members = await prisma.member.findMany({
    orderBy: { id: "asc" },
  });

  if (!season2024 || !season2025 || !season2026) {
    throw new Error("Season data not found");
  }

  const tokyoLeague = leagues.find((l) => l.name === "東京草野球リーグ");
  const sundayLeague = leagues.find((l) => l.name === "日曜リーグ");
  const practiceLeague = leagues.find((l) => l.name === "練習試合");

  if (!tokyoLeague || !sundayLeague || !practiceLeague) {
    throw new Error("League data not found");
  }

  if (members.length < 12) {
    throw new Error("Member data not found (need at least 12 members)");
  }

  // 標準スタメン9名 + ベンチ3名（試合2・3で使用）
  const starters = members.slice(0, 9);
  const benchMembers = members.slice(9, 12);

  // スタメンのポジション・打順マッピング
  const starterPositions: Position[] = [
    "center",
    "shortstop",
    "first",
    "third",
    "left",
    "right",
    "second",
    "catcher",
    "pitcher",
  ];

  const ctx: SeedContext = {
    season2024,
    season2025,
    season2026,
    tokyoLeague,
    sundayLeague,
    practiceLeague,
    grounds,
    opponents,
    members,
    starters,
    benchMembers,
    starterPositions,
  };

  // シーズンごとにデータを投入
  await seedSeason2024(prisma, ctx);
  await seedSeason2025(prisma, ctx);
  await seedSeason2026(prisma, ctx);

  console.log(
    "Created games with innings, game members, plate appearances, and weather",
  );
}
