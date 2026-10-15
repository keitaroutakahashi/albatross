import { GoogleMapEmbed } from "@/app/_components/ui/google-map-embed";
import { SectionGroup } from "@/app/_components/ui/section-group";
import { SubSectionGroup } from "@/app/_components/ui/sub-section-group";
import { YouTubeEmbed } from "@/app/_components/ui/youtube-embed";
import type { GameDetail } from "@/app/_features/games/api/get-games";
import { getExtraBaseHitMembers } from "@/app/_features/games/utils/at-bat-result";
import {
  getPitchers,
  getResponsiblePitcher,
} from "@/app/_features/games/utils/pitching-result";
import { getMembersByPosition } from "@/app/_features/members/utils/position";
import { WeatherIcon } from "@/app/_features/weather/components/weather-icon/weather-icon";
import { resolvePitchingDecision } from "@/app/_utils/stats/pitching-decision";

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
  const responsiblePitcher = getResponsiblePitcher(game.gameMembers);
  const decision = resolvePitchingDecision(
    responsiblePitcher !== undefined,
    game.result,
  );
  const { doubles, triples, homeRuns } = getExtraBaseHitMembers(
    game.gameMembers,
  );
  const catchers = getMembersByPosition(game.gameMembers, "catcher");

  return (
    <SectionGroup title="試合情報">
      {game.mvps.length > 0 && (
        <SubSectionGroup title="MVP">
          <ul className="border-t">
            {game.mvps.map((mvp) => (
              <li key={mvp.id} className="border-b p-3">
                <p className="text-sm font-semibold">
                  {mvp.participant.member.name}
                </p>
                {mvp.comment && (
                  <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                    {mvp.comment}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </SubSectionGroup>
      )}

      <SubSectionGroup title="責任投手・長打">
        <div className="grid grid-cols-[auto_1fr] border-t">
          <TableRow
            label={decision === "win" ? "勝利投手" : "敗戦投手"}
            value={responsiblePitcher?.member.name || ""}
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
        {game.ground ? (
          <div>
            <a
              href={game.ground.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold underline underline-offset-2 hover:opacity-70"
            >
              {game.ground.name}
            </a>
            <p className="text-xs text-gray-500 mt-1">
              ( {game.ground?.address} )
            </p>
            <p className="text-xs mt-2 text-gray-700">{game.ground?.access}</p>
            {game.ground.mapEmbedUrl && (
              <div className="mt-3">
                <GoogleMapEmbed
                  url={game.ground.mapEmbedUrl}
                  title={`${game.ground.name}の地図`}
                />
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm font-semibold">会場未定</p>
        )}
      </SubSectionGroup>

      <SubSectionGroup title="天候">
        <WeatherIcon weather={game.gameWeather?.weather} />
        <p className="text-sm mt-2 text-gray-500">
          {game.gameWeather?.temperature}℃
        </p>
      </SubSectionGroup>

      {game.videoUrl && (
        <SubSectionGroup title="試合動画">
          <YouTubeEmbed url={game.videoUrl} />
        </SubSectionGroup>
      )}
    </SectionGroup>
  );
};
