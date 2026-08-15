import { OUTS_PER_INNING } from "@/app/_utils/stats/innings";

/** WHIP の算出に必要な投球成績 */
type WhipInput = {
  /** 与四球 */
  walks: number;
  /** 被安打 */
  hitsAllowed: number;
  /** 投球回（アウト数換算） */
  outs: number;
};

/**
 * WHIP（Walks plus Hits per Inning Pitched）を算出する。
 *
 * WHIP = (与四球 + 被安打) ÷ 投球回
 *
 * アウトを1つも取っていない場合（投球回 0）は算出できないため `null` を返す。
 */
export const calculateWhip = ({
  walks,
  hitsAllowed,
  outs,
}: WhipInput): number | null => {
  if (outs <= 0) return null;

  return (walks + hitsAllowed) / (outs / OUTS_PER_INNING);
};
