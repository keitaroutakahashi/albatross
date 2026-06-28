import type {
  Prisma,
  PrismaClient,
} from "../../src/generated/prisma/client.js";

const seasonData: Prisma.SeasonCreateInput[] = [
  { season: 2023, name: "2023年度シーズン" },
  { season: 2024, name: "2024年度シーズン" },
  { season: 2025, name: "2025年度シーズン" },
  { season: 2026, name: "2026年度シーズン" },
];

export async function seedSeasons(prisma: PrismaClient) {
  console.log("Seeding seasons...");
  for (const s of seasonData) {
    await prisma.season.create({ data: s });
  }
  console.log(`Created ${seasonData.length} seasons`);
}
