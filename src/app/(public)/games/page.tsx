import { GameList } from "./_components/gameList";

export default function Page() {
  return (
    <div className="">
      <h2 className="">試合一覧</h2>
      <div className="md:max-w-4xl md:mx-auto px-5">
        <GameList />
      </div>
    </div>
  );
}
