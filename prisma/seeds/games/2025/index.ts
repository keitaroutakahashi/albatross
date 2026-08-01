import type { PrismaClient } from "../../../../src/generated/prisma/client.js";
import type { SeedContext } from "../_shared.js";
import { seedGameCanceled } from "./game-canceled.js";
import { seedGameLose } from "./game-lose.js";
import { seedGamePractice } from "./game-practice.js";
import { seedGameScheduled } from "./game-scheduled.js";
import { seedGameWin } from "./game-win.js";

// 2025年シーズンの試合データを投入
export async function seedSeason2025(prisma: PrismaClient, ctx: SeedContext) {
  await seedGameScheduled(prisma, ctx);
  await seedGameCanceled(prisma, ctx);
  await seedGameLose(prisma, ctx);
  await seedGameWin(prisma, ctx);
  await seedGamePractice(prisma, ctx);
}
