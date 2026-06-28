import type { PrismaClient } from "../../../../src/generated/prisma/client.js";
import type { SeedContext } from "../_shared.js";
import { seedGame1 } from "./game1.js";
import { seedGame2 } from "./game2.js";
import { seedGame3 } from "./game3.js";

// 2024年シーズンの試合データを投入
export async function seedSeason2024(prisma: PrismaClient, ctx: SeedContext) {
  await seedGame1(prisma, ctx);
  await seedGame2(prisma, ctx);
  await seedGame3(prisma, ctx);
}
