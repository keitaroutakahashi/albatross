import {
  buildBatHandBatting,
  buildHitDirections,
  buildMonthlyBatting,
  buildOrderBatting,
  buildRolePitching,
  type SplitGameMember,
  summarizeBattingSplit,
} from "@/app/_features/stats/utils/stats-splits";

const member = (overrides: Partial<SplitGameMember>): SplitGameMember => ({
  gameId: 1,
  battingOrder: 1,
  plateAppearances: [],
  pitchingResult: null,
  game: {
    result: "win",
    ground: null,
    // JST で 4 月
    event: { date: new Date("2026-04-05T03:00:00Z") },
  },
  ...overrides,
});

const pa = (result: SplitGameMember["plateAppearances"][number]["result"]) => ({
  result,
  rbi: 0,
  isScoringPosition: false,
  direction: null,
  atBatInGame: 1,
});

describe("summarizeBattingSplit", () => {
  it("試合数は選手の延べ人数ではなく、含まれる試合の数にする", () => {
    const row = summarizeBattingSplit([
      member({ gameId: 1, plateAppearances: [pa("single")] }),
      member({ gameId: 1, plateAppearances: [pa("walk")] }),
      member({ gameId: 2, plateAppearances: [pa("strikeout")] }),
    ]);

    expect(row.games).toBe(2);
    expect(row.plateAppearances).toBe(3);
  });
});

describe("buildMonthlyBatting", () => {
  it("打席のない月は返さず、同じ月は年をまたいで合算する", () => {
    const rows = buildMonthlyBatting([
      member({ gameId: 1, plateAppearances: [pa("single")] }),
      member({
        gameId: 2,
        plateAppearances: [pa("groundOut")],
        game: {
          result: "lose",
          ground: null,
          event: { date: new Date("2025-04-12T03:00:00Z") },
        },
      }),
    ]);

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ month: 4, games: 2, plateAppearances: 2 });
  });
});

describe("buildOrderBatting", () => {
  it("打順の記録がない選手は除き、打順の昇順で返す", () => {
    const rows = buildOrderBatting([
      member({ battingOrder: 3, plateAppearances: [pa("single")] }),
      member({ battingOrder: null, plateAppearances: [pa("single")] }),
      member({ battingOrder: 1, plateAppearances: [pa("walk")] }),
    ]);

    expect(rows.map((r) => r.battingOrder)).toEqual([1, 3]);
  });
});

describe("buildHitDirections", () => {
  it("方向不明の安打がないときは、方向不明の行を返さない", () => {
    const rows = buildHitDirections([
      { result: "single", direction: "left" },
      { result: "double", direction: "shortstop" },
      { result: "strikeout", direction: null },
    ]);

    expect(rows.map((r) => r.zone)).toEqual([
      "infield",
      "left",
      "center",
      "right",
    ]);
    expect(rows.find((r) => r.zone === "infield")?.doubles).toBe(1);
  });
});

describe("buildRolePitching", () => {
  it("登板順 1 を先発、それ以外を中継ぎに分け、登板のない役割は返さない", () => {
    const pitching = {
      inningsPitched: 3,
      partialOuts: null,
      earnedRuns: 0,
      runs: 0,
      strikeouts: 0,
      walks: 0,
      hitByPitches: 0,
      hitsAllowed: 0,
      homeRunsAllowed: 0,
      pitchCount: null,
      isResponsible: false,
    };

    const onlyStarter = buildRolePitching([
      member({ pitchingResult: { ...pitching, pitchingOrder: 1 } }),
    ]);
    expect(onlyStarter.map((r) => r.role)).toEqual(["starter"]);

    const both = buildRolePitching([
      member({ pitchingResult: { ...pitching, pitchingOrder: 1 } }),
      member({ pitchingResult: { ...pitching, pitchingOrder: 2 } }),
    ]);
    expect(both.map((r) => r.role)).toEqual(["starter", "reliever"]);
  });
});

describe("buildBatHandBatting", () => {
  it("右・左・両の順に返し、打席のない区分は返さない", () => {
    const rows = buildBatHandBatting([
      {
        ...member({ gameId: 1, plateAppearances: [pa("walk")] }),
        batHand: "left",
      },
      {
        ...member({ gameId: 1, plateAppearances: [pa("single")] }),
        batHand: "right",
      },
      {
        ...member({ gameId: 2, plateAppearances: [pa("strikeout")] }),
        batHand: "right",
      },
      { ...member({ gameId: 2 }), batHand: "both" },
    ]);

    expect(rows.map((r) => r.batHand)).toEqual(["right", "left"]);
    expect(rows.find((r) => r.batHand === "right")).toMatchObject({
      games: 2,
      plateAppearances: 2,
    });
  });
});
