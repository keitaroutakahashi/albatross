import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { seedGrounds } from "./seeds/common/ground.js";
import { seedMembers } from "./seeds/common/member.js";
import { seedPractices } from "./seeds/development/events/practice.js";
import { seedGames } from "./seeds/development/games/index.js";
import { seedGameParticipants } from "./seeds/development/games/participant.js";
import { seedLeagues } from "./seeds/development/league.js";
import { seedOpponents } from "./seeds/development/opponent.js";
import { seedSeasons } from "./seeds/development/season.js";
import { seedUsers } from "./seeds/development/user.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

// SEED_ENV=production のときは、本番と共通のデータ（グラウンド・選手）だけを投入する
const isProduction = process.env.SEED_ENV === "production";

async function main() {
  console.log(
    `Start seeding... (env: ${isProduction ? "production" : "development"})\n`,
  );

  await seedGrounds(prisma);

  if (!isProduction) {
    await seedSeasons(prisma);
    await seedLeagues(prisma);
    await seedUsers(prisma);
    await seedOpponents(prisma);
  }

  // 開発では user の seed で作ったアカウントに紐づけるため、seedUsers の後に実行する
  await seedMembers(prisma);

  if (!isProduction) {
    await seedGames(prisma);
    await seedGameParticipants(prisma);
    await seedPractices(prisma);
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
