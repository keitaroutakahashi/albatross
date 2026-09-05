import type {
  Prisma,
  PrismaClient,
} from "../../../src/generated/prisma/client.js";

const opponentData: Prisma.OpponentCreateInput[] = [
  { name: "渋谷ファイターズ" },
  { name: "新宿ブルース" },
  { name: "品川スターズ" },
  { name: "目黒サンダース" },
  { name: "世田谷ウィングス" },
];

export async function seedOpponents(prisma: PrismaClient) {
  console.log("Seeding opponents...");
  for (const o of opponentData) {
    await prisma.opponent.create({ data: o });
  }
  console.log(`Created ${opponentData.length} opponents`);
}
