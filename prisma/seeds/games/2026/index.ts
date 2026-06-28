import type { PrismaClient } from "../../../../src/generated/prisma/client.js";
import type { SeedContext } from "../_shared.js";
import { seedGameLose } from "./game-lose";
import { seedGameWin } from "./game-win";

// 2026年シーズンの試合データを投入
export async function seedSeason2026(prisma: PrismaClient, ctx: SeedContext) {
  await seedGameLose(prisma, ctx);
  await seedGameWin(prisma, ctx);
}
