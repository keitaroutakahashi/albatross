import { PageTitle } from "@/app/_components/pageTitle";
import { GameList } from "./_components/gameList";

export default function Page() {
  return (
    <div>
      <PageTitle title="GAME" subtitle="試合情報" />
      <div className="md:max-w-4xl md:mx-auto px-5">
        <GameList />
      </div>
    </div>
  );
}
