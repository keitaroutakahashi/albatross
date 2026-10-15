import {
  describeMatchup,
  describeReview,
  describeSchedule,
  formatGameScore,
  getGameTotals,
} from "@/app/(private)/admin/_utils/event-display";

describe("formatGameScore", () => {
  const base = {
    teamScore: 3,
    opponentScore: 1,
    teamForfeitedRuns: null,
    opponentForfeitedRuns: null,
  };

  it("献上点を含めた合計を返す", () => {
    expect(formatGameScore(base)).toBe("3-1");
    expect(
      formatGameScore({
        ...base,
        teamForfeitedRuns: 2,
        opponentForfeitedRuns: 1,
      }),
    ).toBe("5-2");
  });

  it("得点が未入力なら null", () => {
    expect(formatGameScore({ ...base, teamScore: null })).toBeNull();
  });
});

describe("getGameTotals", () => {
  it("得点に献上点を足した合計を返す。未入力の献上点は 0 として扱う", () => {
    expect(
      getGameTotals({
        teamScore: 3,
        opponentScore: 1,
        teamForfeitedRuns: 2,
        opponentForfeitedRuns: null,
      }),
    ).toEqual({ team: 5, opponent: 1 });
  });

  it("どちらかの得点が未入力なら null", () => {
    expect(
      getGameTotals({
        teamScore: 3,
        opponentScore: null,
        teamForfeitedRuns: null,
        opponentForfeitedRuns: null,
      }),
    ).toBeNull();
  });
});

describe("describeSchedule", () => {
  it("シーズンとグラウンドを並べ、備考があれば添える", () => {
    expect(
      describeSchedule({ season: 2026, groundName: "駒沢", note: null }),
    ).toBe("2026年度 / @駒沢");
    expect(
      describeSchedule({ season: 2026, groundName: null, note: "雨天中止" }),
    ).toBe("2026年度 / @グラウンド未定 / 雨天中止");
  });
});

describe("describeMatchup", () => {
  const base = {
    opponentName: "世田谷ウィングス",
    leagueName: null,
    gameType: "practice" as const,
    isFirstBatting: null,
  };

  it("設定されている項目だけを並べる", () => {
    expect(describeMatchup(base)).toBe("世田谷ウィングス / 練習試合");
    expect(
      describeMatchup({
        ...base,
        leagueName: "世田谷リーグ",
        gameType: "official",
        isFirstBatting: false,
      }),
    ).toBe("世田谷ウィングス / 世田谷リーグ / 公式戦 / 後攻");
  });

  it("リーグ名が試合種別と同じなら、重複して並べない", () => {
    expect(describeMatchup({ ...base, leagueName: "練習試合" })).toBe(
      "世田谷ウィングス / 練習試合",
    );
  });

  it("対戦相手が未定なら、その旨を示す。試合種別が未定なら出さない", () => {
    expect(
      describeMatchup({ ...base, opponentName: null, gameType: "undecided" }),
    ).toBe("対戦相手未定");
  });
});

describe("describeReview", () => {
  const empty = {
    weather: null,
    temperature: null,
    summary: null,
    videoUrl: null,
    aiGoodPoints: null,
    aiBadPoints: null,
    mvpCount: 0,
  };

  it("入力が 1 つもなければ空文字", () => {
    expect(describeReview(empty)).toBe("");
  });

  it("入力のある項目だけを並べる", () => {
    expect(
      describeReview({
        ...empty,
        weather: "sunny",
        temperature: 18,
        summary: "接戦だった",
        aiBadPoints: "守備",
        mvpCount: 2,
      }),
    ).toBe("晴れ 18℃ / 戦評あり / MVP 2人 / AI 講評あり");
  });
});
