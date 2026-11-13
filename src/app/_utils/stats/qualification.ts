import { OUTS_PER_INNING } from "@/app/_utils/stats/innings";

/** 打率などの規定打席（この打席数に達していれば試合数に関わらず対象） */
const QUALIFIED_PLATE_APPEARANCES = 20;

/** 規定打席の試合数あたりの係数（試合数 × この値以上の打席で対象） */
const QUALIFIED_PLATE_APPEARANCES_PER_GAME = 1.5;

/** 防御率などの規定投球回（アウト数換算。この投球回に達していれば試合数に関わらず対象） */
const QUALIFIED_INNINGS_OUTS = 10 * OUTS_PER_INNING;

/**
 * 規定打席を満たしているか判定する。
 *
 * 規定打席: 20 打席以上、またはシーズンの試合数 × 1.5 以上の打席に立っていること。
 *
 * @param plateAppearances 選手のシーズン打席数
 * @param gameCount         シーズンの対象試合数
 */
export const isQualifiedBatter = (
  plateAppearances: number,
  gameCount: number,
): boolean =>
  plateAppearances >= QUALIFIED_PLATE_APPEARANCES ||
  plateAppearances >= gameCount * QUALIFIED_PLATE_APPEARANCES_PER_GAME;

/**
 * 規定投球回を満たしているか判定する。
 *
 * 規定投球回: 10 イニング以上、またはシーズンの試合数以上を投げていること。
 *
 * @param outs      投手のシーズン投球アウト数
 * @param gameCount シーズンの対象試合数
 */
export const isQualifiedPitcher = (outs: number, gameCount: number): boolean =>
  outs >= QUALIFIED_INNINGS_OUTS || outs >= gameCount * OUTS_PER_INNING;
