import { eventMemberSchema } from "@/app/(private)/admin/_schemas/event-member";
import { inningSchema } from "@/app/(private)/admin/_schemas/inning";
import { pitchingResultSchema } from "@/app/(private)/admin/_schemas/pitching-result";

describe("inningSchema", () => {
  const forfeited = {
    teamForfeitedRuns: "0",
    opponentForfeitedRuns: "0",
    teamErrors: "0",
  };

  it("同名の入力欄が複数なら配列、1 件なら文字列でも配列として扱う", () => {
    expect(
      inningSchema.parse({
        ...forfeited,
        teamScore: ["1", "0"],
        opponentScore: ["0", "2"],
      }),
    ).toEqual({
      teamScore: [1, 0],
      opponentScore: [0, 2],
      teamForfeitedRuns: 0,
      opponentForfeitedRuns: 0,
      teamErrors: 0,
    });
    expect(
      inningSchema.parse({ ...forfeited, teamScore: "3", opponentScore: "1" }),
    ).toMatchObject({ teamScore: [3], opponentScore: [1] });
  });

  it("イニングが 0 件でも通る", () => {
    expect(inningSchema.parse({ ...forfeited })).toMatchObject({
      teamScore: [],
      opponentScore: [],
    });
  });

  it("献上点を数値にする（0 は 0 として扱う）", () => {
    expect(
      inningSchema.parse({
        teamScore: ["1"],
        opponentScore: ["0"],
        teamForfeitedRuns: "2",
        opponentForfeitedRuns: "0",
        teamErrors: "3",
      }),
    ).toMatchObject({
      teamForfeitedRuns: 2,
      opponentForfeitedRuns: 0,
      teamErrors: 3,
    });
  });

  it("失策が未入力・負数・小数ならエラーにする", () => {
    const base = {
      teamScore: ["1"],
      opponentScore: ["0"],
      teamForfeitedRuns: "0",
      opponentForfeitedRuns: "0",
    };
    for (const teamErrors of ["", "-1", "1.5", "100"]) {
      expect(inningSchema.safeParse({ ...base, teamErrors }).success).toBe(
        false,
      );
    }
  });

  it("献上点が未入力・負数・小数ならエラーにする", () => {
    const base = { teamScore: ["1"], opponentScore: ["0"], teamErrors: "0" };
    expect(
      inningSchema.safeParse({
        ...base,
        teamForfeitedRuns: "",
        opponentForfeitedRuns: "0",
      }).success,
    ).toBe(false);
    expect(
      inningSchema.safeParse({
        ...base,
        teamForfeitedRuns: "-1",
        opponentForfeitedRuns: "0",
      }).success,
    ).toBe(false);
    expect(
      inningSchema.safeParse({
        ...base,
        teamForfeitedRuns: "0",
        opponentForfeitedRuns: "1.5",
      }).success,
    ).toBe(false);
  });

  it("自チームと相手の回数が合わない・得点が不正ならエラーにする", () => {
    expect(
      inningSchema.safeParse({
        ...forfeited,
        teamScore: ["1", "2"],
        opponentScore: ["0"],
      }).success,
    ).toBe(false);
    expect(
      inningSchema.safeParse({
        ...forfeited,
        teamScore: ["-1"],
        opponentScore: ["0"],
      }).success,
    ).toBe(false);
    expect(
      inningSchema.safeParse({
        ...forfeited,
        teamScore: [""],
        opponentScore: ["0"],
      }).success,
    ).toBe(false);
  });
});

describe("pitchingResultSchema", () => {
  const valid = {
    gameMemberId: "5",
    pitchingOrder: "1",
    inningsPitched: "5",
    partialOuts: "",
    earnedRuns: "1",
    runs: "2",
    strikeouts: "6",
    walks: "0",
    hitByPitches: "0",
    hitsAllowed: "4",
    homeRunsAllowed: "0",
    pitchCount: "",
  };

  it("任意項目の未入力は null にし、0 は 0 として扱う", () => {
    expect(pitchingResultSchema.parse(valid)).toMatchObject({
      partialOuts: null,
      pitchCount: null,
      isResponsible: false,
      walks: 0,
    });
  });

  it("途中のアウト数は 0〜2 のみ許可する", () => {
    expect(
      pitchingResultSchema.parse({ ...valid, partialOuts: "0" }),
    ).toMatchObject({ partialOuts: 0 });
    expect(
      pitchingResultSchema.safeParse({ ...valid, partialOuts: "3" }).success,
    ).toBe(false);
  });

  it("責任投手はチェックされたときだけ true にする", () => {
    expect(
      pitchingResultSchema.parse({ ...valid, isResponsible: "on" }),
    ).toMatchObject({ isResponsible: true });
  });
});

describe("eventMemberSchema", () => {
  it("選択 0 件・1 件・複数件をすべて ID の配列にする", () => {
    expect(eventMemberSchema.parse({})).toEqual({ memberIds: [] });
    expect(eventMemberSchema.parse({ memberIds: "3" })).toEqual({
      memberIds: [3],
    });
    expect(eventMemberSchema.parse({ memberIds: ["1", "2"] })).toEqual({
      memberIds: [1, 2],
    });
  });
});
