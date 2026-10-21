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

type Row = { label: string; value: string };

export const GameInfo = ({ game }: Props) => {
  const isScheduled = game.event.status === "scheduled";
  // 終了した試合は、情報があるものだけを表示する。予定・中止の試合は、枠を空のまま表示する
  const hideEmpty = game.event.status === "completed";
  const pitchers = isScheduled
    ? // 試合前は投手成績がないため、オーダーで投手の守備位置に入っている選手を表示する
      getMembersByPosition(game.gameMembers, "pitcher")
    : getPitchers(game.gameMembers);
  const responsiblePitcher = getResponsiblePitcher(game.gameMembers);
  const decision = resolvePitchingDecision(
    responsiblePitcher !== undefined,
    game.result,
  );
  const { doubles, triples, homeRuns } = getExtraBaseHitMembers(
    game.gameMembers,
  );
  const catchers = getMembersByPosition(game.gameMembers, "catcher");

  const names = (members: GameDetail["gameMembers"]) =>
    members.map((gm) => gm.member.name).join("、");
  const visibleRows = (rows: Row[]) =>
    hideEmpty ? rows.filter((row) => row.value !== "") : rows;

  const responsibleRows = visibleRows([
    {
      label:
        decision === "win"
          ? "勝利投手"
          : decision === "loss"
            ? "敗戦投手"
            : "責任投手",
      value: responsiblePitcher?.member.name || "",
    },
    { label: "二塁打", value: names(doubles) },
    { label: "三塁打", value: names(triples) },
    { label: "本塁打", value: names(homeRuns) },
  ]);
  const batteryRows = visibleRows([
    { label: "投手", value: names(pitchers) },
    { label: "捕手", value: names(catchers) },
  ]);

  const showMvp = isScheduled || game.mvps.length > 0;
  const showGround = !hideEmpty || game.ground !== null;
  const showWeather = !hideEmpty || game.gameWeather !== null;
  const showVideo = !!game.videoUrl;
  const showExternalLink = !!game.externalUrl;

  if (
    hideEmpty &&
    !showMvp &&
    responsibleRows.length === 0 &&
    batteryRows.length === 0 &&
    !showGround &&
    !showWeather &&
    !showVideo &&
    !showExternalLink
  ) {
    return null;
  }

  return (
    <SectionGroup title="試合情報">
      {showMvp && (
        <SubSectionGroup title="MVP">
          {!isScheduled && (
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
          )}
        </SubSectionGroup>
      )}

      {responsibleRows.length > 0 && (
        <SubSectionGroup title="責任投手・長打">
          <div className="grid grid-cols-[auto_1fr] border-t">
            {responsibleRows.map((row) => (
              <TableRow key={row.label} label={row.label} value={row.value} />
            ))}
          </div>
        </SubSectionGroup>
      )}

      {batteryRows.length > 0 && (
        <SubSectionGroup title="バッテリー">
          <div className="grid grid-cols-[auto_1fr] border-t">
            {batteryRows.map((row) => (
              <TableRow key={row.label} label={row.label} value={row.value} />
            ))}
          </div>
        </SubSectionGroup>
      )}

      {showGround && (
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
              {game.groundCourt && (
                <p className="mt-1 text-sm font-semibold">{game.groundCourt}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                ( {game.ground?.address} )
              </p>
              <p className="text-xs mt-2 text-gray-700">
                {game.ground?.access}
              </p>
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
      )}

      {showWeather && (
        <SubSectionGroup title="天候">
          {!isScheduled && (
            <>
              <WeatherIcon weather={game.gameWeather?.weather} />
              {game.gameWeather?.temperature != null && (
                <p className="text-sm mt-2 text-gray-500">
                  {game.gameWeather.temperature}℃
                </p>
              )}
            </>
          )}
        </SubSectionGroup>
      )}

      {showVideo && game.videoUrl && (
        <SubSectionGroup title="試合動画">
          <YouTubeEmbed url={game.videoUrl} />
        </SubSectionGroup>
      )}

      {game.externalUrl && (
        <SubSectionGroup title="外部リンク">
          <a
            href={game.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-sm font-semibold underline underline-offset-2 hover:opacity-70"
          >
            {new URL(game.externalUrl).hostname}
          </a>
        </SubSectionGroup>
      )}
    </SectionGroup>
  );
};
