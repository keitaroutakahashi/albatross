import { getCurrentRole } from "@/app/(private)/admin/_utils/auth";
import prisma from "@/lib/prisma";

export const getMasterCounts = async () => {
  await getCurrentRole();
  const [events, seasons, leagues, opponents, grounds, members, users] =
    await Promise.all([
      prisma.event.count(),
      prisma.season.count(),
      prisma.league.count(),
      prisma.opponent.count(),
      prisma.ground.count(),
      prisma.member.count(),
      prisma.user.count(),
    ]);

  return { events, seasons, leagues, opponents, grounds, members, users };
};
