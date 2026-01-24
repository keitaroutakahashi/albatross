import type { GameData } from "@/app/(public)/games/_dummy/data";

type Props = {
	game: GameData;
};

export const GameSummary = ({ game }: Props) => {
	if (!game.summary) {
		return null;
	}

	return (
		<div className="mb-6">
			<h2 className="text-lg font-bold mb-3 border-b-2 border-gray-800 pb-2">
				戦評
			</h2>
			<p className="text-sm leading-relaxed text-gray-700">{game.summary}</p>
		</div>
	);
};
