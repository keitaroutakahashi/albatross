export type GameCounts = {
  participants: number;
  gameMembers: number;
  innings: number;
  plateAppearances: number;
  pitchingResults: number;
};

/** 基本情報の項目（いつ・どこで / 対戦 / 試合の振り返り）の入力状況 */
export type BasicInfo = {
  done: boolean;
  /** 現在の値の要約（例: 2026年度 / @駒沢） */
  text: string;
};

export type ProgressStep = {
  /** URL の末尾（/admin/events/{id}/{path}） */
  path:
    | "schedule"
    | "matchup"
    | "members"
    | "lineup"
    | "innings"
    | "at-bats"
    | "pitching"
    | "review";
  title: string;
  done: boolean;
  /** 入力済みのときに示す内容の目安（「11人」など）。未入力のときは空 */
  summary: string;
  /** 現在の値の要約。なければ null */
  description: string | null;
  /** 先に入力が必要な項目があるときの案内。なければ null */
  blockedBy: string | null;
  /** 任意の項目。「次にやること」には出さない */
  optional: boolean;
};

const unit = (count: number, suffix: string) =>
  count === 0 ? "" : `${count}${suffix}`;

const basicStep = (
  path: ProgressStep["path"],
  title: string,
  info: BasicInfo,
  doneSummary: string,
  optional = false,
): ProgressStep => ({
  path,
  title,
  done: info.done,
  summary: info.done ? doneSummary : "",
  description: info.text === "" ? null : info.text,
  blockedBy: null,
  optional,
});

const membersStep = (participants: number): ProgressStep => ({
  path: "members",
  title: "参加メンバー",
  done: participants > 0,
  summary: unit(participants, "人"),
  description: null,
  blockedBy: null,
  optional: false,
});

/** 試合の入力項目を、入力する順番に並べる。試合前に決めるものを先頭に、振り返りを最後に置く */
export const buildGameSteps = (
  counts: GameCounts,
  basics: { schedule: BasicInfo; matchup: BasicInfo; review: BasicInfo },
): ProgressStep[] => {
  const needsParticipants =
    counts.participants === 0 ? "先に「参加メンバー」を入力してください" : null;
  const needsLineup =
    counts.gameMembers === 0 ? "先に「オーダー」を入力してください" : null;

  return [
    basicStep("schedule", "いつ・どこで", basics.schedule, "設定済み"),
    basicStep("matchup", "対戦", basics.matchup, "設定済み"),
    membersStep(counts.participants),
    {
      path: "lineup",
      title: "オーダー",
      done: counts.gameMembers > 0,
      summary: unit(counts.gameMembers, "人"),
      description: null,
      blockedBy: needsParticipants,
      optional: false,
    },
    {
      path: "innings",
      title: "イニングごとの得点",
      done: counts.innings > 0,
      summary: unit(counts.innings, "回"),
      description: null,
      blockedBy: null,
      optional: false,
    },
    {
      path: "at-bats",
      title: "打席の結果",
      done: counts.plateAppearances > 0,
      summary: unit(counts.plateAppearances, "打席"),
      description: null,
      blockedBy: needsLineup,
      optional: false,
    },
    {
      path: "pitching",
      title: "投手の成績",
      done: counts.pitchingResults > 0,
      summary: unit(counts.pitchingResults, "人"),
      description: null,
      blockedBy: needsLineup,
      optional: false,
    },
    basicStep("review", "試合の振り返り", basics.review, "入力済み", true),
  ];
};

/** 練習で入力する項目は、いつ・どこでと参加メンバーだけ */
export const buildPracticeSteps = (
  participants: number,
  schedule: BasicInfo,
): ProgressStep[] => [
  basicStep("schedule", "いつ・どこで", schedule, "設定済み"),
  membersStep(participants),
];

/** 次に入力する項目（任意の項目を除く最初の未入力）。なければ undefined */
export const findNextStep = (steps: ProgressStep[]): ProgressStep | undefined =>
  steps.find((step) => !step.done && !step.optional);
