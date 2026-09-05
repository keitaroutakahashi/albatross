import type { ColumnDef } from "@/app/_components/ui/data-table";
import { DataTable } from "@/app/_components/ui/data-table";
import { SectionGroup } from "@/app/_components/ui/section-group";
import { SubSectionGroup } from "@/app/_components/ui/sub-section-group";
import type { GameDetail } from "@/app/_features/games/api/get-games";
import {
  hitResults,
  nonAtBatResults,
} from "@/app/_features/games/utils/at-bat-result";
import {
  calculateBattingAverage,
  calculateOnBasePercentage,
  calculateSluggingPercentage,
} from "@/app/_utils/stats/batting";
import { formatEraFromStats } from "@/app/_utils/stats/era";
import { formatRate } from "@/app/_utils/stats/rate";

type Props = {
  game: GameDetail;
};

/** チーム打撃集計 */
type TeamBattingStats = {
  avg: string;
  slg: string;
  obp: string;
  pa: number;
  ab: number;
  h: number;
  doubles: number;
  triples: number;
  hr: number;
  rbi: number;
  sb: number;
  bb: number;
  hbp: number;
  sh: number;
  sf: number;
  so: number;
};

/** 全メンバーの打席データからチーム集計を算出 */
const calcTeamBattingStats = (
  members: GameDetail["gameMembers"],
): TeamBattingStats => {
  const allPAs = members.flatMap((gm) => gm.plateAppearances);

  const ab = allPAs.filter((pa) => !nonAtBatResults.includes(pa.result)).length;
  const h = allPAs.filter((pa) => hitResults.includes(pa.result)).length;
  const bb = allPAs.filter((pa) => pa.result === "walk").length;
  const hbp = allPAs.filter((pa) => pa.result === "hitByPitch").length;
  const sf = allPAs.filter((pa) => pa.result === "sacrificeFly").length;

  let totalBases = 0;
  for (const pa of allPAs) {
    if (pa.result === "single") totalBases += 1;
    if (pa.result === "double") totalBases += 2;
    if (pa.result === "triple") totalBases += 3;
    if (pa.result === "homeRun") totalBases += 4;
  }

  const average = calculateBattingAverage({ hits: h, atBats: ab });
  const sluggingPercentage = calculateSluggingPercentage({
    totalBases,
    atBats: ab,
  });
  const onBasePercentage = calculateOnBasePercentage({
    hits: h,
    walks: bb + hbp,
    atBats: ab,
    sacrificeFlies: sf,
  });

  return {
    avg: formatRate(average, ".000"),
    slg: formatRate(sluggingPercentage, ".000"),
    obp: formatRate(onBasePercentage, ".000"),
    pa: allPAs.length,
    ab,
    h,
    doubles: allPAs.filter((pa) => pa.result === "double").length,
    triples: allPAs.filter((pa) => pa.result === "triple").length,
    hr: allPAs.filter((pa) => pa.result === "homeRun").length,
    rbi: allPAs.reduce((sum, pa) => sum + pa.rbi, 0),
    sb: members.reduce((sum, gm) => sum + gm.stolenBases, 0),
    bb,
    hbp,
    sh: allPAs.filter((pa) => pa.result === "sacrificeHit").length,
    sf,
    so: allPAs.filter((pa) => pa.result === "strikeout").length,
  };
};

/** チーム投手集計 */
type TeamPitchingStats = {
  era: string;
  hitsAllowed: number;
  homeRunsAllowed: number;
  strikeouts: number;
  walks: number;
  hitByPitches: number;
  runs: number;
  earnedRuns: number;
};

/** 全投手の成績からチーム集計を算出 */
const calcTeamPitchingStats = (
  members: GameDetail["gameMembers"],
): TeamPitchingStats => {
  const pitchers = members
    .map((gm) => gm.pitchingResult)
    .filter((pr) => pr != null);

  // 防御率は浮動小数点の誤差を避けるため、完了イニングとアウト数を
  // それぞれ整数で積算し、calculateEra（アウト総数ベース）に渡す。
  let inningsPitched = 0;
  let partialOuts = 0;
  let earnedRuns = 0;
  let runs = 0;
  let hitsAllowed = 0;
  let homeRunsAllowed = 0;
  let strikeouts = 0;
  let walks = 0;
  let hitByPitches = 0;

  for (const pr of pitchers) {
    inningsPitched += pr.inningsPitched;
    partialOuts += pr.partialOuts ?? 0;
    earnedRuns += pr.earnedRuns;
    runs += pr.runs;
    hitsAllowed += pr.hitsAllowed;
    homeRunsAllowed += pr.homeRunsAllowed;
    strikeouts += pr.strikeouts;
    walks += pr.walks;
    hitByPitches += pr.hitByPitches;
  }

  return {
    era: formatEraFromStats({ earnedRuns, inningsPitched, partialOuts }),
    hitsAllowed,
    homeRunsAllowed,
    strikeouts,
    walks,
    hitByPitches,
    runs,
    earnedRuns,
  };
};

const pitchingColumns: ColumnDef<TeamPitchingStats>[] = [
  { key: "era", header: "防御率", cell: (row) => row.era },
  { key: "hitsAllowed", header: "安", cell: (row) => row.hitsAllowed },
  {
    key: "homeRunsAllowed",
    header: "本",
    cell: (row) => row.homeRunsAllowed,
  },
  { key: "strikeouts", header: "三振", cell: (row) => row.strikeouts },
  { key: "walks", header: "四", cell: (row) => row.walks },
  { key: "hitByPitches", header: "死", cell: (row) => row.hitByPitches },
  { key: "runs", header: "失", cell: (row) => row.runs },
  { key: "earnedRuns", header: "自責", cell: (row) => row.earnedRuns },
];

const battingColumns: ColumnDef<TeamBattingStats>[] = [
  { key: "avg", header: "打率", cell: (row) => row.avg },
  { key: "slg", header: "長打率", cell: (row) => row.slg },
  { key: "obp", header: "出塁率", cell: (row) => row.obp },
  { key: "pa", header: "打席", cell: (row) => row.pa },
  { key: "ab", header: "打数", cell: (row) => row.ab },
  { key: "h", header: "安", cell: (row) => row.h },
  { key: "2b", header: "二", cell: (row) => row.doubles },
  { key: "3b", header: "三", cell: (row) => row.triples },
  { key: "hr", header: "本", cell: (row) => row.hr },
  { key: "rbi", header: "打点", cell: (row) => row.rbi },
  { key: "sb", header: "盗", cell: (row) => row.sb },
  { key: "bb", header: "四", cell: (row) => row.bb },
  { key: "hbp", header: "死", cell: (row) => row.hbp },
  { key: "sh", header: "犠打", cell: (row) => row.sh },
  { key: "sf", header: "犠飛", cell: (row) => row.sf },
  { key: "so", header: "三振", cell: (row) => row.so },
];

export const GameStats = ({ game }: Props) => {
  const members = game.gameMembers;

  if (members.length === 0) {
    return null;
  }

  const stats = calcTeamBattingStats(members);
  const pitchingStats = calcTeamPitchingStats(members);

  return (
    <SectionGroup title="チーム成績">
      <SubSectionGroup title="打者成績">
        <DataTable
          columns={battingColumns}
          data={[stats]}
          keyExtractor={() => "team"}
        />
      </SubSectionGroup>
      <SubSectionGroup title="投手成績">
        <DataTable
          columns={pitchingColumns}
          data={[pitchingStats]}
          keyExtractor={() => "team"}
        />
      </SubSectionGroup>
    </SectionGroup>
  );
};
