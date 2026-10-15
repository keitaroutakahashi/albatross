import {
  type BasicInfo,
  buildGameSteps,
  buildPracticeSteps,
  findNextStep,
} from "@/app/(private)/admin/_utils/event-progress";

const empty = {
  participants: 0,
  gameMembers: 0,
  innings: 0,
  plateAppearances: 0,
  pitchingResults: 0,
};

const unset: BasicInfo = { done: false, text: "" };
const set = (text: string): BasicInfo => ({ done: true, text });
const noBasics = { schedule: unset, matchup: unset, review: unset };
const allBasics = {
  schedule: set("2026年度 / @駒沢"),
  matchup: set("世田谷ウィングス"),
  review: set("晴れ 18℃"),
};

describe("buildGameSteps", () => {
  it("試合前に決める項目を先頭、振り返りを最後に並べる", () => {
    expect(buildGameSteps(empty, noBasics).map((s) => s.path)).toEqual([
      "schedule",
      "matchup",
      "members",
      "lineup",
      "innings",
      "at-bats",
      "pitching",
      "review",
    ]);
  });

  it("何も入力していなければ、すべて未入力で、先に必要な項目を案内する", () => {
    const steps = buildGameSteps(empty, noBasics);
    expect(steps.every((s) => !s.done && s.summary === "")).toBe(true);
    expect(steps.map((s) => s.blockedBy)).toEqual([
      null,
      null,
      null,
      "先に「参加メンバー」を入力してください",
      null,
      "先に「オーダー」を入力してください",
      "先に「オーダー」を入力してください",
      null,
    ]);
  });

  it("入力済みの項目は完了にして、件数や値の要約を添える", () => {
    const steps = buildGameSteps(
      {
        participants: 11,
        gameMembers: 10,
        innings: 7,
        plateAppearances: 4,
        pitchingResults: 2,
      },
      allBasics,
    );
    expect(steps.every((s) => s.done && s.blockedBy === null)).toBe(true);
    expect(steps.map((s) => s.summary)).toEqual([
      "設定済み",
      "設定済み",
      "11人",
      "10人",
      "7回",
      "4打席",
      "2人",
      "入力済み",
    ]);
    expect(steps[0].description).toBe("2026年度 / @駒沢");
  });

  it("値の要約が空なら description は null にする", () => {
    expect(buildGameSteps(empty, noBasics)[0].description).toBeNull();
  });
});

describe("findNextStep", () => {
  it("最初の未入力の項目を返す（登録直後は、いつ・どこで）", () => {
    expect(findNextStep(buildGameSteps(empty, noBasics))?.path).toBe(
      "schedule",
    );
  });

  it("前の項目を入力済みなら、その次の項目を返す", () => {
    const steps = buildGameSteps(
      { ...empty, participants: 11, gameMembers: 10 },
      { ...allBasics, review: unset },
    );
    expect(findNextStep(steps)?.path).toBe("innings");
  });

  it("試合の振り返りは任意のため、残っていても案内しない", () => {
    const steps = buildGameSteps(
      {
        participants: 11,
        gameMembers: 10,
        innings: 7,
        plateAppearances: 4,
        pitchingResults: 2,
      },
      { ...allBasics, review: unset },
    );
    expect(findNextStep(steps)).toBeUndefined();
  });
});

describe("buildPracticeSteps", () => {
  it("いつ・どこでと参加メンバーだけを返す", () => {
    expect(buildPracticeSteps(0, unset)).toMatchObject([
      { path: "schedule", done: false },
      { path: "members", done: false, summary: "" },
    ]);
  });

  it("両方入力済みなら、案内する項目はない", () => {
    expect(
      findNextStep(buildPracticeSteps(5, set("2026年度 / @駒沢"))),
    ).toBeUndefined();
  });
});
