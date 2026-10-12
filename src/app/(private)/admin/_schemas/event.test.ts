import {
  eventBasicSchema,
  eventCreateSchema,
  eventResultSchema,
} from "@/app/(private)/admin/_schemas/event";

const base = {
  date: "2026-10-25T09:00",
  status: "scheduled",
  seasonId: "2",
  note: "",
};

const validGameBasic = {
  ...base,
  type: "game",
  gameNumber: "1",
  gameType: "official",
  isFirstBatting: "",
  leagueId: "",
  groundId: "",
  opponentId: "3",
  weather: "",
  temperature: "",
  summary: "",
  videoUrl: "",
  aiGoodPoints: "",
  aiBadPoints: "",
};

const validResult = {
  teamHits: "",
  opponentHits: "",
  teamErrors: "",
  opponentErrors: "",
};

describe("eventBasicSchema", () => {
  it("試合: 日時を日本時間として解釈し、未入力は null にする", () => {
    const result = eventBasicSchema.parse(validGameBasic);
    expect(result).toMatchObject({
      type: "game",
      seasonId: 2,
      gameNumber: 1,
      gameType: "official",
      opponentId: 3,
      leagueId: null,
      groundId: null,
      isFirstBatting: null,
      note: null,
      weather: null,
      temperature: null,
      summary: null,
      videoUrl: null,
    });
    expect(result.date.toISOString()).toBe("2026-10-25T00:00:00.000Z");
  });

  it("試合: 先攻・後攻を真偽値に変換する", () => {
    expect(
      eventBasicSchema.parse({ ...validGameBasic, isFirstBatting: "false" }),
    ).toMatchObject({ isFirstBatting: false });
  });

  it("試合: 天候・気温を変換する", () => {
    expect(
      eventBasicSchema.parse({
        ...validGameBasic,
        weather: "rainy",
        temperature: "21.5",
      }),
    ).toMatchObject({ weather: "rainy", temperature: 21.5 });
  });

  it("試合: 天気がないまま気温だけ入力するとエラーにする", () => {
    const result = eventBasicSchema.safeParse({
      ...validGameBasic,
      temperature: "20",
    });
    expect(result.error?.issues[0]).toMatchObject({
      path: ["weather"],
      message: "気温を入力する場合は天気も選択してください",
    });
  });

  it("試合: 動画 URL の形式が不正ならエラーにする", () => {
    const result = eventBasicSchema.safeParse({
      ...validGameBasic,
      videoUrl: "foo",
    });
    expect(result.error?.issues[0]).toMatchObject({
      path: ["videoUrl"],
      message: "URL の形式で入力してください",
    });
  });

  it("試合: 得点などの試合結果は受け取らない", () => {
    const result = eventBasicSchema.parse({
      ...validGameBasic,
      teamScore: "5",
    });
    expect(result).not.toHaveProperty("teamScore");
  });

  it("練習: 試合用の項目がなくても通る", () => {
    expect(
      eventBasicSchema.parse({ ...base, type: "practice", groundId: "1" }),
    ).toMatchObject({ type: "practice", groundId: 1 });
  });

  it("種別が不正ならエラーにする", () => {
    expect(eventBasicSchema.safeParse({ ...base, type: "party" }).success).toBe(
      false,
    );
  });

  it("日時の形式が不正ならエラーにする", () => {
    const result = eventBasicSchema.safeParse({
      ...validGameBasic,
      date: "2026/10/25",
    });
    expect(result.error?.issues[0]).toMatchObject({
      path: ["date"],
      message: "日時の形式が正しくありません",
    });
  });

  it("試合番号・試合種別が不正ならエラーにする", () => {
    expect(
      eventBasicSchema.safeParse({ ...validGameBasic, gameNumber: "0" })
        .success,
    ).toBe(false);
    expect(
      eventBasicSchema.safeParse({ ...validGameBasic, gameType: "league" })
        .success,
    ).toBe(false);
  });
});

describe("eventResultSchema", () => {
  it("未入力はすべて null にする", () => {
    expect(eventResultSchema.parse(validResult)).toEqual({
      teamHits: null,
      opponentHits: null,
      teamErrors: null,
      opponentErrors: null,
    });
  });

  it("0 は未入力ではなく 0 として扱う", () => {
    expect(
      eventResultSchema.parse({
        ...validResult,
        teamHits: "0",
        teamErrors: "0",
      }),
    ).toMatchObject({ teamHits: 0, teamErrors: 0 });
  });

  it("得点・献上点は受け取らない（イニングごとの得点から設定する）", () => {
    const result = eventResultSchema.parse({
      ...validResult,
      teamScore: "5",
      teamForfeitedRuns: "1",
    });
    expect(result).not.toHaveProperty("teamScore");
    expect(result).not.toHaveProperty("teamForfeitedRuns");
  });

  it("範囲外・小数ならエラーにする", () => {
    expect(
      eventResultSchema.safeParse({ ...validResult, teamHits: "100" }).success,
    ).toBe(false);
    expect(
      eventResultSchema.safeParse({ ...validResult, teamErrors: "1.5" })
        .success,
    ).toBe(false);
  });
});

describe("eventCreateSchema", () => {
  it("試合: 種別・日時・シーズン・試合番号・試合種別だけで通る", () => {
    const result = eventCreateSchema.parse({
      type: "game",
      date: "2026-10-25T09:00",
      seasonId: "2",
      gameNumber: "1",
      gameType: "undecided",
    });
    expect(result).toMatchObject({
      type: "game",
      seasonId: 2,
      gameNumber: 1,
      gameType: "undecided",
    });
    expect(result.date.toISOString()).toBe("2026-10-25T00:00:00.000Z");
  });

  it("練習: 試合番号・試合種別は不要", () => {
    expect(
      eventCreateSchema.parse({
        type: "practice",
        date: "2026-10-25T09:00",
        seasonId: "2",
      }),
    ).toMatchObject({ type: "practice", seasonId: 2 });
  });

  it("状態は受け取らない（常に開催予定で登録する）", () => {
    const result = eventCreateSchema.parse({
      type: "practice",
      date: "2026-10-25T09:00",
      seasonId: "2",
      status: "completed",
    });
    expect(result).not.toHaveProperty("status");
  });

  it("試合: 試合番号・試合種別が未入力ならエラーにする", () => {
    const result = eventCreateSchema.safeParse({
      type: "game",
      date: "2026-10-25T09:00",
      seasonId: "2",
    });
    expect(result.error?.issues.map((i) => i.path[0])).toEqual([
      "gameNumber",
      "gameType",
    ]);
  });

  it("種別が不正・シーズン未選択ならエラーにする", () => {
    expect(
      eventCreateSchema.safeParse({ type: "party", date: "2026-10-25T09:00" })
        .success,
    ).toBe(false);
    expect(
      eventCreateSchema.safeParse({
        type: "practice",
        date: "2026-10-25T09:00",
        seasonId: "",
      }).success,
    ).toBe(false);
  });
});
