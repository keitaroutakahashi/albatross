import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { seedGames } from "./seeds/development/games/index.js";
import { seedGrounds } from "./seeds/development/ground.js";
import { seedLeagues } from "./seeds/development/league.js";
import { seedMembers } from "./seeds/development/member.js";
import { seedOpponents } from "./seeds/development/opponent.js";
import { seedSeasons } from "./seeds/development/season.js";
import { seedUsers } from "./seeds/development/user.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

// SEED_ENV=production のときは開発用データを投入しない
const isProduction = process.env.SEED_ENV === "production";

async function main() {
  console.log(`Start seeding... (env: ${isProduction ? "production" : "development"})\n`);

  if (!isProduction) {
    await seedSeasons(prisma);
    await seedLeagues(prisma);
    await seedGrounds(prisma);
    await seedUsers(prisma);
    await seedOpponents(prisma);
    await seedMembers(prisma);
    await seedGames(prisma);
  }

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
