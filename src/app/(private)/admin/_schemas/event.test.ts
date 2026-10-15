import {
  eventCreateSchema,
  eventMatchupSchema,
  eventReviewSchema,
  eventScheduleSchema,
} from "@/app/(private)/admin/_schemas/event";

describe("eventScheduleSchema", () => {
  const valid = {
    date: "2026-10-25T09:00",
    seasonId: "2",
    groundId: "",
    note: "",
    cancelReason: "",
  };

  it("日時を日本時間として解釈し、未入力は null にする", () => {
    const result = eventScheduleSchema.parse(valid);
    expect(result).toMatchObject({
      seasonId: 2,
      groundId: null,
      note: null,
      cancelReason: null,
    });
    expect(result.date.toISOString()).toBe("2026-10-25T00:00:00.000Z");
  });

  it("グラウンド・備考・中止理由を受け取る", () => {
    expect(
      eventScheduleSchema.parse({
        ...valid,
        groundId: "3",
        note: "集合 8:30",
        cancelReason: "雨天中止",
      }),
    ).toMatchObject({
      groundId: 3,
      note: "集合 8:30",
      cancelReason: "雨天中止",
    });
  });

  it("日時の形式が不正ならエラーにする", () => {
    const result = eventScheduleSchema.safeParse({
      ...valid,
      date: "2026/10/25",
    });
    expect(result.error?.issues[0]).toMatchObject({
      path: ["date"],
      message: "日時の形式が正しくありません",
    });
  });

  it("状態・試合番号は受け取らない", () => {
    const result = eventScheduleSchema.parse({
      ...valid,
      status: "completed",
      gameNumber: "3",
    });
    expect(result).not.toHaveProperty("status");
    expect(result).not.toHaveProperty("gameNumber");
  });
});

describe("eventMatchupSchema", () => {
  const valid = {
    opponentId: "3",
    leagueId: "",
    gameType: "official",
    isFirstBatting: "",
  };

  it("未入力は null にする", () => {
    expect(eventMatchupSchema.parse(valid)).toEqual({
      opponentId: 3,
      leagueId: null,
      gameType: "official",
      isFirstBatting: null,
    });
  });

  it("先攻・後攻を真偽値に変換する", () => {
    expect(
      eventMatchupSchema.parse({ ...valid, isFirstBatting: "false" }),
    ).toMatchObject({ isFirstBatting: false });
  });

  it("試合種別が不正ならエラーにする", () => {
    expect(
      eventMatchupSchema.safeParse({ ...valid, gameType: "league" }).success,
    ).toBe(false);
  });
});

describe("eventReviewSchema", () => {
  const valid = {
    weather: "",
    temperature: "",
    summary: "",
    videoUrl: "",
    aiGoodPoints: "",
    aiBadPoints: "",
  };

  it("すべて未入力でも通り、null にする", () => {
    expect(eventReviewSchema.parse(valid)).toEqual({
      weather: null,
      temperature: null,
      summary: null,
      videoUrl: null,
      aiGoodPoints: null,
      aiBadPoints: null,
    });
  });

  it("天候・気温を変換する", () => {
    expect(
      eventReviewSchema.parse({
        ...valid,
        weather: "rainy",
        temperature: "21.5",
      }),
    ).toMatchObject({ weather: "rainy", temperature: 21.5 });
  });

  it("天気がないまま気温だけ入力するとエラーにする", () => {
    const result = eventReviewSchema.safeParse({ ...valid, temperature: "20" });
    expect(result.error?.issues[0]).toMatchObject({
      path: ["weather"],
      message: "気温を入力する場合は天気も選択してください",
    });
  });

  it("動画 URL は、YouTube の埋め込み用の URL に直して保存する", () => {
    expect(
      eventReviewSchema.parse({
        ...valid,
        videoUrl: "https://youtu.be/5b3pysWf_Yk?si=54JGTd5Vah9xIvcb",
      }),
    ).toMatchObject({
      videoUrl: "https://www.youtube.com/embed/5b3pysWf_Yk",
    });
    expect(
      eventReviewSchema.parse({
        ...valid,
        videoUrl: "https://www.youtube.com/watch?v=5b3pysWf_Yk&t=90",
      }),
    ).toMatchObject({
      videoUrl: "https://www.youtube.com/embed/5b3pysWf_Yk?start=90",
    });
  });

  it("YouTube の動画 URL でなければ、動画 URL の欄にエラーを返す", () => {
    for (const videoUrl of ["foo", "https://example.com/video"]) {
      const result = eventReviewSchema.safeParse({ ...valid, videoUrl });
      expect(result.error?.issues[0]).toMatchObject({
        path: ["videoUrl"],
        message: "YouTube の動画 URL を入力してください",
      });
    }
  });

  it("得点などの試合結果は受け取らない", () => {
    expect(
      eventReviewSchema.parse({ ...valid, teamScore: "5" }),
    ).not.toHaveProperty("teamScore");
  });
});

describe("eventCreateSchema", () => {
  it("試合: 種別・日時・シーズン・試合種別だけで通る（試合番号は自動で付く）", () => {
    const result = eventCreateSchema.parse({
      type: "game",
      date: "2026-10-25T09:00",
      seasonId: "2",
      gameType: "undecided",
    });
    expect(result).toMatchObject({
      type: "game",
      seasonId: 2,
      gameType: "undecided",
    });
    expect(result).not.toHaveProperty("gameNumber");
    expect(result.date.toISOString()).toBe("2026-10-25T00:00:00.000Z");
  });

  it("練習: 試合種別は不要", () => {
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

  it("試合: 試合種別が未入力ならエラーにする", () => {
    const result = eventCreateSchema.safeParse({
      type: "game",
      date: "2026-10-25T09:00",
      seasonId: "2",
    });
    expect(result.error?.issues.map((i) => i.path[0])).toEqual(["gameType"]);
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
