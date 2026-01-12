import { notFound } from "next/navigation";
import { getGameById } from "@/app/(public)/games/_dummy/data";
import { GameHeader } from "./_components/gameHeader";
import { ScoreBoard } from "./_components/scoreBoard";

type Props = {
	params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
	const { id } = await params;
	const gameId = Number.parseInt(id, 10);

	if (Number.isNaN(gameId)) {
		notFound();
	}

	const game = getGameById(gameId);

	if (!game) {
		notFound();
	}

	return (
		<div className="md:max-w-4xl md:mx-auto px-5 py-6">
			<GameHeader game={game} />
			<ScoreBoard game={game} />
		</div>
	);
}
