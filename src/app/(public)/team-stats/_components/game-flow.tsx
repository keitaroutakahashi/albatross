import { type ColumnDef, DataTable } from "@/app/_components/ui/data-table";
import { HintTooltip } from "@/app/_components/ui/hint-tooltip";
import { SubSectionGroup } from "@/app/_components/ui/sub-section-group";
import {
  BIG_DEFICIT_RUNS,
  GAME_FLOW_KEYS,
  type GameFlowKey,
  type GameFlowSummary,
} from "@/app/_utils/stats/game-flow";
import type { TeamRecord } from "@/app/_utils/stats/team-record";
import { HeaderWithHint } from "@/app/(public)/team-stats/_components/header-with-hint";
import { recordColumns } from "@/app/(public)/team-stats/_components/record-columns";

type Props = {
  gameFlow: GameFlowSummary;
};

const FLOW_LABEL: Record<GameFlowKey, { label: string; hint: string }> = {
  scoredFirst: {
    label: "先制した試合",
    hint: "最初に得点したのが自チームだった試合です。",
  },
  concededFirst: {
    label: "先制された試合",
    hint: "最初に得点したのが相手だった試合です。",
  },
  wasLeading: {
    label: "リードした試合",
    hint: "試合中に一度でもリードした試合です。この負けが逆転負けです。",
  },
  wasTrailing: {
    label: "リードされた試合",
    hint: "試合中に一度でもリードされた試合です。この勝ちが逆転勝ちです。",
  },
  wasBigTrailing: {
    label: `${BIG_DEFICIT_RUNS} 点以上リードされた試合`,
    hint: `試合中に一度でも ${BIG_DEFICIT_RUNS} 点以上リードされた試合です。この勝ちが ${BIG_DEFICIT_RUNS} 点以上のビハインドからの逆転勝ちです。`,
  },
  oneRun: {
    label: "1 点差の試合",
    hint: "最終スコアの差が 1 点だった試合です。",
  },
};

type Row = TeamRecord & { key: GameFlowKey };

const columns: ColumnDef<Row>[] = [
  {
    key: "label",
    header: (
      <HeaderWithHint
        label="展開"
        hint="先制・リードは、先攻・後攻とイニングごとの得点の記録がある試合が対象です。1 点差の試合は最終スコアだけで判定します。"
      />
    ),
    align: "left",
    cell: (r) => (
      <span className="inline-flex items-center gap-1">
        {FLOW_LABEL[r.key].label}
        <HintTooltip text={FLOW_LABEL[r.key].hint} />
      </span>
    ),
  },
  ...recordColumns<Row>(),
];

/** 先制・逆転・接戦など、試合の展開別の戦績 */
export const GameFlow = ({ gameFlow }: Props) => {
  const rows: Row[] = GAME_FLOW_KEYS.map((key) => ({
    key,
    ...gameFlow[key],
  }));

  return (
    <SubSectionGroup title="試合展開別の戦績">
      <DataTable
        columns={columns}
        data={rows}
        keyExtractor={(r) => r.key}
        sticky={{ count: 1, offsets: ["left-0"] }}
      />
    </SubSectionGroup>
  );
};
