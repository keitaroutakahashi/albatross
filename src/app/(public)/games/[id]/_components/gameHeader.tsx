import Link from "next/link";
import type { GameData } from "@/app/(public)/games/_dummy/data";
import {
	formatAsMDWithColon,
	formatAsYYYY,
	formatToShortDayNameEn,
} from "@/app/_utils/date/date";

type Props = {
	game: GameData;
};

export const GameHeader = ({ game }: Props) => {
	return (
		<div className="mb-6">
			<Link
				href="/games"
				className="inline-flex items-center text-sm text-gray-600 hover:text-black mb-4"
			>
				<span className="mr-1">←</span>
				試合一覧に戻る
			</Link>

			<div className="bg-gray-100 p-4 rounded">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
					<div className="flex items-center gap-x-2">
						<p className="text-3xl font-bold">
							{formatAsMDWithColon(game.gameDate)}
						</p>
						<div>
							<p className="text-xs text-gray-500 font-bold">
								{formatToShortDayNameEn(game.gameDate)}
							</p>
							<p className="text-xs font-bold">{formatAsYYYY(game.gameDate)}</p>
						</div>
					</div>
					<div className="flex flex-col md:items-end gap-1">
						<p className="font-bold text-sm">{game.leagueName}</p>
						<p className="text-sm text-gray-600">{game.venue}</p>
					</div>
				</div>
			</div>
		</div>
	);
};
