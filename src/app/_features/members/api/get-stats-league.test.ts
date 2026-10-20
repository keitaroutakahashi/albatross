import { getBattingStats } from "@/app/_features/members/api/get-batting-stats";
import { getPitchingStats } from "@/app/_features/members/api/get-pitching-stats";
import prisma from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  default: {
    game: { count: vi.fn() },
    gameMember: { findMany: vi.fn() },
    pitchingResult: { findMany: vi.fn() },
  },
}));

beforeEach(() => {
  vi.mocked(prisma.game.count).mockResolvedValue(4);
  vi.mocked(prisma.gameMember.findMany).mockResolvedValue([]);
  vi.mocked(prisma.pitchingResult.findMany).mockResolvedValue([]);
});

describe.each([
  { name: "打撃成績", fetch: getBattingStats },
  { name: "投球成績", fetch: getPitchingStats },
])("$name のリーグ絞り込み", ({ fetch }) => {
  it("リーグを指定すると、そのリーグの試合だけに絞る（試合数の集計も同じ条件）", async () => {
    const result = await fetch(2026, 7);

    expect(prisma.game.count).toHaveBeenCalledWith({
      where: expect.objectContaining({ gameType: "official", leagueId: 7 }),
    });
    expect(result.leagueId).toBe(7);
    expect(result.gameCount).toBe(4);
  });

  it("リーグを指定しなければ、リーグでは絞り込まない", async () => {
    const result = await fetch(2026);

    const where = vi.mocked(prisma.game.count).mock.calls[0]?.[0]?.where;
    expect(where).not.toHaveProperty("leagueId");
    expect(result.leagueId).toBeNull();
  });
});

describe("成績の取得条件", () => {
  it("打撃成績の選手の取得にも、同じリーグの条件を使う", async () => {
    await getBattingStats(2026, 7);

    expect(prisma.gameMember.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          game: expect.objectContaining({ leagueId: 7 }),
        }),
      }),
    );
  });

  it("投球成績の登板の取得にも、同じリーグの条件を使う", async () => {
    await getPitchingStats(2026, 7);

    expect(prisma.pitchingResult.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          gameMember: expect.objectContaining({
            game: expect.objectContaining({ leagueId: 7 }),
          }),
        }),
      }),
    );
  });
});
