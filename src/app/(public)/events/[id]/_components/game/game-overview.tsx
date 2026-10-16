import Image from "next/image";
import { InitialIcon } from "@/app/_components/ui/initial-icon";
import type { GameDetail } from "@/app/_features/games/api/get-games";
import { getGameStatusText } from "@/app/_features/games/utils/get-game-status-text";
import { OverviewBackground } from "@/app/(public)/events/[id]/_components/overview-background";

type Props = {
  game: GameDetail;
};

export const GameOverview = ({ game }: Props) => {
  return (
    <div className="relative py-14 @content:py-20">
      <OverviewBackground imagePath={game.ground?.imagePath} />
      <div className="@content:max-w-4xl px-3 @content:mx-auto relative grid grid-cols-[1fr_2fr_1fr] gap-4 place-items-center text-white">
        {game.isFirstBatting ? (
          <Image
            src="/images/logo-initial.png"
            alt="Albatross Logo"
            width={128}
            height={128}
            className="w-12 @content:w-24 h-auto"
          />
        ) : (
          <InitialIcon name={game.opponent?.name ?? "未定"} size="xl" />
        )}

        <div className="flex flex-col items-center justify-center gap-y-4">
          <p className="font-bold text-sm @content:text-base text-center">
            [ {getGameStatusText(game.event.status)} ]
          </p>
          {game.event.status === "canceled" && game.event.cancelReason && (
            <p className="text-sm text-center">{game.event.cancelReason}</p>
          )}

          <div className="grid grid-cols-3 place-items-center">
            <span className="text-4xl @content:text-7xl font-bold tracking-wider">
              {game.isFirstBatting ? game.teamScore : game.opponentScore}
            </span>
            <span className="text-2xl @content:text-5xl font-bold">-</span>
            <span className="text-4xl @content:text-7xl font-bold tracking-wider">
              {game.isFirstBatting ? game.opponentScore : game.teamScore}
            </span>
          </div>

          <p className="font-bold text-sm @content:text-base text-center">
            {[game.ground?.name, game.groundCourt].filter(Boolean).join(" ")}
          </p>
        </div>

        {!game.isFirstBatting ? (
          <Image
            src="/images/logo-initial.png"
            alt="Albatross Logo"
            width={128}
            height={128}
            className="w-12 @content:w-24 h-auto"
          />
        ) : (
          <InitialIcon name={game.opponent?.name ?? "未定"} size="xl" />
        )}
      </div>
    </div>
  );
};
