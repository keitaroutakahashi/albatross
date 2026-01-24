import type { GameData } from "@/app/(public)/games/_dummy/data";

type Props = {
	game: GameData;
};

export const GamePitchers = ({ game }: Props) => {
	const { pitchers, homeRuns } = game;

	return (
		<div className="mb-6">
			<h2 className="text-lg font-bold mb-3 border-b-2 border-gray-800 pb-2">
				責任投手・本塁打
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="bg-gray-50 p-4 rounded">
					<h3 className="text-sm font-bold mb-2 text-gray-600">責任投手</h3>
					<div className="space-y-1 text-sm">
						<div className="flex">
							<span className="w-20 text-gray-500">勝</span>
							<span className="font-medium">
								{pitchers?.winningPitcher || "-"}
							</span>
						</div>
						<div className="flex">
							<span className="w-20 text-gray-500">負</span>
							<span className="font-medium">
								{pitchers?.losingPitcher || "-"}
							</span>
						</div>
						<div className="flex">
							<span className="w-20 text-gray-500">S</span>
							<span className="font-medium">
								{pitchers?.savePitcher || "-"}
							</span>
						</div>
					</div>
				</div>
				<div className="bg-gray-50 p-4 rounded">
					<h3 className="text-sm font-bold mb-2 text-gray-600">本塁打</h3>
					{homeRuns && homeRuns.length > 0 ? (
						<div className="space-y-1 text-sm">
							{homeRuns.map((hr) => (
								<div key={`${hr.playerName}-${hr.count}`} className="flex">
									<span className="font-medium">{hr.playerName}</span>
									{hr.description && (
										<span className="ml-2 text-gray-500">
											({hr.description})
										</span>
									)}
								</div>
							))}
						</div>
					) : (
						<p className="text-sm text-gray-500">-</p>
					)}
				</div>
			</div>
		</div>
	);
};
