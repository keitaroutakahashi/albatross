import type { AtBatResult, Position } from "@/generated/prisma/client";

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
