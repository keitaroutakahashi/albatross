import type { GameWithRelations } from "@/app/_features/games/api/getGames";
import { SectionHeader } from "@/app/(public)/games/[id]/_components/sectionHeader";
import { SectionSubtitle } from "@/app/(public)/games/[id]/_components/sectionSubTitle";

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
  game: GameWithRelations;
};

export const GameInfo = ({ game }: Props) => {
  return (
    <section className="mb-6">
      <SectionHeader text="試合情報" />
      <div className="flex flex-col gap-6">
        <section>
          <SectionSubtitle text="責任投手・長打" />
          <div className="grid grid-cols-[auto_1fr] border-t">
            <TableRow label="勝利投手" value="石川" />
            <TableRow label="敗戦投手" value="田中" />
            <TableRow label="二塁打" value="田中、鈴木、佐藤" />
            <TableRow label="三塁打" value="遠藤" />
            <TableRow label="本塁打" value="太田" />
          </div>
        </section>

        <section>
          <SectionSubtitle text="バッテリー" />
          <div className="border-t border-b py-2">
            <p className="text-sm">石川、渡辺、諸橋 - 高橋</p>
          </div>
        </section>

        <section>
          <SectionSubtitle text="試合動画" />
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
        </section>

        <section>
          <SectionSubtitle text="グラウンド" />
          <p className="">{game.ground?.name}</p>
          <p className="text-sm mt-2 text-gray-500">{game.ground?.address}</p>
        </section>
      </div>
    </section>
  );
};
