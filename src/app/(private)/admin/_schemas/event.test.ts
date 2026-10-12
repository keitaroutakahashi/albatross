import { eventSchema } from "@/app/(private)/admin/_schemas/event";

const base = {
  date: "2026-10-25T09:00",
  status: "scheduled",
  seasonId: "2",
  note: "",
};

const validGame = {
  ...base,
  type: "game",
  gameNumber: "1",
  gameType: "official",
  isFirstBatting: "",
  leagueId: "",
  groundId: "",
  opponentId: "3",
  teamScore: "",
  opponentScore: "",
  teamHits: "",
  opponentHits: "",
  teamErrors: "",
  opponentErrors: "",
  teamForfeitedRuns: "",
  opponentForfeitedRuns: "",
  weather: "",
  temperature: "",
  summary: "",
  videoUrl: "",
  aiGoodPoints: "",
  aiBadPoints: "",
};

describe("eventSchema", () => {
  it("試合: 日時を日本時間として解釈し、未入力は null にする", () => {
    const result = eventSchema.parse(validGame);
    expect(result).toMatchObject({
      type: "game",
      seasonId: 2,
      opponentId: 3,
      leagueId: null,
      teamScore: null,
      isFirstBatting: null,
      weather: null,
      temperature: null,
      videoUrl: null,
      note: null,
    });
    expect(result.date.toISOString()).toBe("2026-10-25T00:00:00.000Z");
  });

  it("試合: 0 点は未入力ではなく 0 として扱う", () => {
    expect(
      eventSchema.parse({ ...validGame, teamScore: "0", opponentScore: "0" }),
    ).toMatchObject({ teamScore: 0, opponentScore: 0 });
  });

  it("試合: 先攻・後攻と天候・気温を変換する", () => {
    expect(
      eventSchema.parse({
        ...validGame,
        isFirstBatting: "false",
        weather: "rainy",
        temperature: "21.5",
      }),
    ).toMatchObject({
      isFirstBatting: false,
      weather: "rainy",
      temperature: 21.5,
    });
  });

  it("試合: 天気がないまま気温だけ入力するとエラーにする", () => {
    const result = eventSchema.safeParse({ ...validGame, temperature: "20" });
    expect(result.error?.issues[0]).toMatchObject({
      path: ["weather"],
      message: "気温を入力する場合は天気も選択してください",
    });
  });

  it("練習: 試合用の項目がなくても通る", () => {
    expect(
      eventSchema.parse({ ...base, type: "practice", groundId: "1" }),
    ).toMatchObject({ type: "practice", groundId: 1 });
  });

  it("種別が不正ならエラーにする", () => {
    const result = eventSchema.safeParse({ ...base, type: "party" });
    expect(result.success).toBe(false);
  });

  it("日時の形式が不正ならエラーにする", () => {
    const result = eventSchema.safeParse({ ...validGame, date: "2026/10/25" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]).toMatchObject({
      path: ["date"],
      message: "日時の形式が正しくありません",
    });
  });

  it("得点が範囲外・小数ならエラーにする", () => {
    expect(
      eventSchema.safeParse({ ...validGame, teamScore: "100" }).success,
    ).toBe(false);
    expect(
      eventSchema.safeParse({ ...validGame, teamScore: "1.5" }).success,
    ).toBe(false);
  });

  it("動画 URL の形式が不正ならエラーにする", () => {
    const result = eventSchema.safeParse({ ...validGame, videoUrl: "foo" });
    expect(result.error?.issues[0]).toMatchObject({
      path: ["videoUrl"],
      message: "URL の形式で入力してください",
    });
  });
});
