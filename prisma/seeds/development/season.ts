import type {
  Prisma,
  PrismaClient,
} from "../../../src/generated/prisma/client.js";

const seasonData: Prisma.SeasonCreateInput[] = [
  { season: 2025 },
  { season: 2026 },
];

export async function seedSeasons(prisma: PrismaClient) {
  console.log("Seeding seasons...");
  for (const s of seasonData) {
    await prisma.season.create({ data: s });
  }
  console.log(`Created ${seasonData.length} seasons`);
}
