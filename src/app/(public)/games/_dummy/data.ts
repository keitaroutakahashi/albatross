export interface InningScore {
	inning: number;
	ourScore: number;
	opponentScore: number;
}

export interface GameData {
	id: number;
	gameDate: string;
	leagueName: string;
	opposingTeam: string;
	venue: string;
	teamScore: number;
	opposingTeamScore: number;
	result: "win" | "lose" | "draw";
	pitcher: string;
	isHome: boolean;
	innings: InningScore[];
}

export const data: GameData[] = [
	{
		id: 1,
		gameDate: "2024-10-01",
		leagueName: "サタデーリーグ",
		opposingTeam: "タイガース",
		venue: "東京ドーム",
		teamScore: 5,
		opposingTeamScore: 3,
		result: "win",
		pitcher: "山田 太郎",
		isHome: true,
		innings: [
			{ inning: 1, ourScore: 1, opponentScore: 0 },
			{ inning: 2, ourScore: 0, opponentScore: 1 },
			{ inning: 3, ourScore: 2, opponentScore: 0 },
			{ inning: 4, ourScore: 0, opponentScore: 0 },
			{ inning: 5, ourScore: 1, opponentScore: 2 },
			{ inning: 6, ourScore: 0, opponentScore: 0 },
			{ inning: 7, ourScore: 1, opponentScore: 0 },
		],
	},
	{
		id: 2,
		gameDate: "2025-11-01",
		leagueName: "サンデーリーグ",
		opposingTeam: "ベアーズ",
		venue: "市民球場",
		teamScore: 10,
		opposingTeamScore: 20,
		result: "lose",
		pitcher: "鈴木 次郎",
		isHome: false,
		innings: [
			{ inning: 1, ourScore: 2, opponentScore: 3 },
			{ inning: 2, ourScore: 1, opponentScore: 4 },
			{ inning: 3, ourScore: 0, opponentScore: 2 },
			{ inning: 4, ourScore: 3, opponentScore: 5 },
			{ inning: 5, ourScore: 2, opponentScore: 3 },
			{ inning: 6, ourScore: 1, opponentScore: 2 },
			{ inning: 7, ourScore: 1, opponentScore: 1 },
		],
	},
];

export const getGameById = (id: number): GameData | undefined => {
	return data.find((game) => game.id === id);
};
