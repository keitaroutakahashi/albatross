import type { PrismaClient } from "../../../../src/generated/prisma/client.js";

// 試合参加メンバー。出場した選手（GameMember）は参加メンバーの中から選ぶため、
// シードした試合の出場者をそのまま参加メンバーとして登録する
export async function seedGameParticipants(prisma: PrismaClient) {
  console.log("Seeding game participants...");

  const gameMembers = await prisma.gameMember.findMany({
    select: { gameId: true, memberId: true },
  });
  const result = await prisma.gameParticipant.createMany({
    data: gameMembers,
    skipDuplicates: true,
  });

  console.log(`Created ${result.count} game participants`);
}
