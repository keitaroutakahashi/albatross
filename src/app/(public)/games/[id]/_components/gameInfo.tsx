import type { GameDetail } from "@/app/_features/games/api/getGames";
import { getExtraBaseHitMembers } from "@/app/_features/games/utils/atBatResult";
import {
  getMemberWithPitchingDecision,
  getPitchers,
} from "@/app/_features/games/utils/pitchingResult";
import { getMembersByPosition } from "@/app/_features/members/position";
import { getWeatherText } from "@/app/_features/weather/utils/getWeatherText";
import { SectionGroup } from "@/app/(public)/games/[id]/_components/sectionGroup";
import { SubSectionGroup } from "@/app/(public)/games/[id]/_components/subSectionGroup";

type TableRowProps = {
  label: string;
  value: string;
};

const TableRow = ({ label, value }: TableRowProps) => {
  return (
    <>
      <p className="bg-gray-100 p-3 border-b text-sm">{label}</p>
      <p className="p-3 border-b text-sm">{value}</p>
    </>
  );
};

type Props = {
  game: GameDetail;
};

export const GameInfo = ({ game }: Props) => {
  const pitchers = getPitchers(game.gameMembers);
  const pitchingDecisionMember = getMemberWithPitchingDecision(
    game.gameMembers,
  );
  const { doubles, triples, homeRuns } = getExtraBaseHitMembers(
    game.gameMembers,
  );
  const catchers = getMembersByPosition(game.gameMembers, "catcher");

  return (
    <SectionGroup title="試合情報">
      <SubSectionGroup title="責任投手・長打">
        <div className="grid grid-cols-[auto_1fr] border-t">
          <TableRow
            label={
              pitchingDecisionMember?.pitchingResult?.decision === "win"
                ? "勝利投手"
                : "敗戦投手"
            }
            value={pitchingDecisionMember?.member.name || ""}
          />
          <TableRow
            label="二塁打"
            value={doubles.map((gm) => gm.member.name).join("、")}
          />
          <TableRow
            label="三塁打"
            value={triples.map((gm) => gm.member.name).join("、")}
          />
          <TableRow
            label="本塁打"
            value={homeRuns.map((gm) => gm.member.name).join("、")}
          />
        </div>
      </SubSectionGroup>

      <SubSectionGroup title="バッテリー">
        <div className="grid grid-cols-[auto_1fr] border-t">
          <TableRow
            label="投手"
            value={pitchers.map((gm) => gm.member.name).join("、")}
          />
          <TableRow
            label="捕手"
            value={catchers.map((gm) => gm.member.name).join("、")}
          />
        </div>
      </SubSectionGroup>

      <SubSectionGroup title="グラウンド">
        <p className="">{game.ground?.name}</p>
        <p className="text-sm mt-2 text-gray-500">{game.ground?.address}</p>
      </SubSectionGroup>

      <SubSectionGroup title="天候">
        <p className="">{getWeatherText(game.gameWeather?.weather)}</p>
        <p className="text-sm mt-2 text-gray-500">
          {game.gameWeather?.temperature}℃
        </p>
      </SubSectionGroup>

      <SubSectionGroup title="試合動画">
        <iframe
          className="w-full h-full md:w-140 md:h-78.75"
          width="560"
          height="315"
          src="https://www.youtube.com/embed/Zf2lra7LTcI?si=v2QMsZIEnygJVmGW"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </SubSectionGroup>
    </SectionGroup>
  );
};
