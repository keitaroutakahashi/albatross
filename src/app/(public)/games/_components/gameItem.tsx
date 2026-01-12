import Image from "next/image";
import Link from "next/link";
import {
	formatAsMDWithColon,
	formatAsYYYY,
	formatToShortDayNameEn,
} from "@/app/_utils/date/date";
import type { GameData } from "@/app/(public)/games/_dummy/data";

type Props = {
	game: GameData;
};

const getResultBadge = (result: GameData["result"]) => {
	switch (result) {
		case "win":
			return { text: "勝", className: "bg-green-600" };
		case "lose":
			return { text: "負", className: "bg-red-600" };
		case "draw":
			return { text: "分", className: "bg-gray-500" };
	}
};

export const GameItem = ({ game }: Props) => {
	const resultBadge = getResultBadge(game.result);

	return (
		<li>
			<Link
				href={`/games/${game.id}`}
				className="flex flex-col md:flex-row border border-gray-300 rounded overflow-hidden hover:border-black transition cursor-pointer"
			>
				<div className="bg-gray-100 p-3 md:p-4 flex md:flex-col md:w-64 justify-between items-center">
					<div className="flex items-center gap-x-1">
						<p className="text-3xl font-bold">
							{formatAsMDWithColon(game.gameDate)}
						</p>
						<div className="">
							<p className="text-xs text-gray-500 font-bold">
								{formatToShortDayNameEn(game.gameDate)}
							</p>
							<p className="text-xs font-bold">{formatAsYYYY(game.gameDate)}</p>
						</div>
					</div>
					<p className="font-bold text-sm">{game.leagueName}</p>
				</div>

				<div className="grid grid-cols-3 p-3 md:px-10 md:flex-1">
					<div className="flex flex-col items-center justify-center gap-y-2">
						<Image
							src="/images/logo-initial.png"
							alt="Team A Logo"
							width={30}
							height={35}
						/>
						<span className="font-bold">Albatross</span>
						<div className="flex items-center space-x-2">
							<span
								className={`${resultBadge.className} text-white text-xs rounded size-5 font-bold flex items-center justify-center`}
							>
								{resultBadge.text}
							</span>
							<span className="text-xs">{game.pitcher}</span>
						</div>
					</div>
					<div className="flex flex-col items-center justify-center">
						<p className="text-sm font-bold">{game.venue}</p>
						<div className="">
							<span className="text-4xl font-bold">{game.teamScore}</span>
							<span className="text-4xl font-bold mx-2">-</span>
							<span className="text-4xl font-bold">{game.opposingTeamScore}</span>
						</div>
					</div>
					<div className="flex flex-col items-center justify-center gap-y-2">
						<div className="size-9 bg-gray-300 rounded flex justify-center items-center font-bold">
							{game.opposingTeam.charAt(0)}
						</div>
						<span className="font-bold">{game.opposingTeam}</span>
					</div>
				</div>
			</Link>
		</li>
	);
};
