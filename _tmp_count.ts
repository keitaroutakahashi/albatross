import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./src/generated/prisma/client.js";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const seasons = await prisma.season.count();
  const games = await prisma.game.count();
  const members = await prisma.member.count();
  const users = await prisma.user.count();
  console.log(JSON.stringify({ seasons, games, members, users }));
}

main().finally(() => prisma.$disconnect());
