import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { seedGames } from "./seeds/game.js";
import { seedGrounds } from "./seeds/ground.js";
import { seedLeagues } from "./seeds/league.js";
import { seedOpponents } from "./seeds/opponent.js";
import { seedSeasons } from "./seeds/season.js";
import { seedUsers } from "./seeds/user.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Start seeding...\n");

  // マスタデータを先に投入
  await seedUsers(prisma);
  await seedSeasons(prisma);
  await seedLeagues(prisma);
  await seedGrounds(prisma);
  await seedOpponents(prisma);

  // 試合データを投入（マスタに依存）
  await seedGames(prisma);

  console.log("\nSeeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
