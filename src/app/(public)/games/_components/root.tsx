import { Suspense } from "react";
import { PageTitle } from "@/app/_components/ui/pageTitle";
import { GameList } from "@/app/(public)/games/_components/gameList";
import { SeasonFilter } from "@/app/(public)/games/_components/seasonFilter";

type Props = {
  season?: string;
};

export const Root = async ({ season }: Props) => {
  return (
    <div>
      <PageTitle title="GAME" subtitle="試合情報" />

      <div className="flex justify-center mt-5">
        <Suspense fallback={<div>Loading...</div>}>
          <SeasonFilter />
        </Suspense>
      </div>

      <div className="md:max-w-4xl md:mx-auto px-5 mt-10">
        <GameList season={season} />
      </div>
    </div>
  );
};
