import type { AtBatResult, Hand, Position } from "@/generated/prisma/client";

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
