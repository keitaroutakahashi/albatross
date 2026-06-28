import type { PrismaClient } from "../../../../src/generated/prisma/client.js";
import type { SeedContext } from "../_shared.js";
import { seedGame4 } from "./game4.js";
import { seedGame5 } from "./game5.js";
import { seedGame6 } from "./game6.js";
import { seedGame7 } from "./game7.js";

// 2025年シーズンの試合データを投入
export async function seedSeason2025(prisma: PrismaClient, ctx: SeedContext) {
  await seedGame4(prisma, ctx);
  await seedGame5(prisma, ctx);
  await seedGame6(prisma, ctx);
  await seedGame7(prisma, ctx);
}
