import type {
  Prisma,
  PrismaClient,
} from "../../../src/generated/prisma/client.js";

const leagueData: Prisma.LeagueCreateInput[] = [
  { name: "東京草野球リーグ" },
  { name: "日曜リーグ" },
  { name: "練習試合" },
];

export async function seedLeagues(prisma: PrismaClient) {
  console.log("Seeding leagues...");
  for (const l of leagueData) {
    await prisma.league.create({ data: l });
  }
  console.log(`Created ${leagueData.length} leagues`);
}
