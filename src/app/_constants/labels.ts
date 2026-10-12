import type {
  AtBatResult,
  EventStatus,
  GameResult,
  GameType,
  Hand,
  MemberCategory,
  PitchingDecision,
  Position,
  UserRole,
  Weather,
} from "@/generated/prisma/client";

export const positionLabel: Record<Position, string> = {
  pitcher: "投",
  catcher: "捕",
  first: "一",
  second: "二",
  third: "三",
  shortstop: "遊",
  left: "左",
  center: "中",
  right: "右",
  dh: "DH",
};

export const positionFullLabel: Record<Position, string> = {
  pitcher: "投手",
  catcher: "捕手",
  first: "一塁手",
  second: "二塁手",
  third: "三塁手",
  shortstop: "遊撃手",
  left: "左翼手",
  center: "中堅手",
  right: "右翼手",
  dh: "指名打者",
};

export const resultLabel: Record<AtBatResult, string> = {
  single: "安",
  double: "二",
  triple: "三",
  homeRun: "本",
  walk: "四球",
  hitByPitch: "死球",
  strikeout: "三振",
  groundOut: "ゴ",
  flyOut: "飛",
  lineOut: "直",
  sacrificeHit: "犠打",
  sacrificeFly: "犠飛",
  fieldersChoice: "野選",
  doublePlay: "併殺",
  error: "失",
};

export const handLabel: Record<Hand, string> = {
  left: "左",
  right: "右",
  both: "両",
};

export const memberCategoryLabel: Record<MemberCategory, string> = {
  regular: "正規メンバー",
  guest: "助っ人",
};

export const eventStatusLabel: Record<EventStatus, string> = {
  scheduled: "開催予定",
  completed: "開催済み",
  canceled: "中止",
};

export const gameTypeLabel: Record<GameType, string> = {
  official: "公式戦",
  practice: "練習試合",
  undecided: "未定",
};

export const gameResultLabel: Record<GameResult, string> = {
  win: "勝",
  lose: "負",
  draw: "分",
};

export const weatherLabel: Record<Weather, string> = {
  sunny: "晴れ",
  cloudy: "曇り",
  rainy: "雨",
  snowy: "雪",
};

export const atBatResultFullLabel: Record<AtBatResult, string> = {
  single: "単打",
  double: "二塁打",
  triple: "三塁打",
  homeRun: "本塁打",
  walk: "四球",
  hitByPitch: "死球",
  strikeout: "三振",
  groundOut: "ゴロアウト",
  flyOut: "フライアウト",
  lineOut: "ライナーアウト",
  sacrificeHit: "犠打",
  sacrificeFly: "犠飛",
  fieldersChoice: "フィルダースチョイス",
  doublePlay: "併殺打",
  error: "エラー出塁",
};

export const pitchingDecisionLabel: Record<PitchingDecision, string> = {
  win: "勝ち投手",
  loss: "負け投手",
};

export const userRoleLabel: Record<UserRole, string> = {
  admin: "管理者",
  operator: "運営",
};
