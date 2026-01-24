export interface InningScore {
	inning: number;
	ourScore: number;
	opponentScore: number;
}

export interface PitcherInfo {
	winningPitcher?: string;
	losingPitcher?: string;
	savePitcher?: string;
}

export interface HomeRunInfo {
	playerName: string;
	count: number;
	description?: string;
}

export interface StartingPlayer {
	battingOrder: number;
	position: string;
	name: string;
}

export interface BattingResult {
	position: string;
	name: string;
	battingAverage: string;
	atBats: number;
	hits: number;
	rbi: number;
	homeRuns: number;
	stolenBases: number;
	inningResults: string[];
}

export interface PitchingResult {
	name: string;
	inningsPitched: string;
	hitsAllowed: number;
	strikeouts: number;
	runs: number;
	earnedRuns: number;
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
	summary?: string;
	pitchers?: PitcherInfo;
	homeRuns?: HomeRunInfo[];
	duration?: string;
	participants?: number;
	startingLineup?: StartingPlayer[];
	battingResults?: BattingResult[];
	pitchingResults?: PitchingResult[];
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
		summary:
			"山田投手が6回2失点の好投！佐藤選手の決勝タイムリーでリードを奪い、5対3で勝利！初回に先制点を挙げると、3回には佐藤選手の2点タイムリーで追加点。山田投手は要所を締める投球で6回を投げ切り、最後は田中投手がしっかりと抑えて逃げ切った。",
		pitchers: {
			winningPitcher: "山田 太郎",
			losingPitcher: "相手投手A",
			savePitcher: "田中 三郎",
		},
		homeRuns: [{ playerName: "佐藤 四郎", count: 1, description: "3号ソロ" }],
		duration: "2時間15分",
		participants: 18,
		startingLineup: [
			{ battingOrder: 1, position: "中", name: "佐藤 四郎" },
			{ battingOrder: 2, position: "二", name: "高橋 五郎" },
			{ battingOrder: 3, position: "左", name: "伊藤 六郎" },
			{ battingOrder: 4, position: "三", name: "渡辺 七郎" },
			{ battingOrder: 5, position: "一", name: "小林 八郎" },
			{ battingOrder: 6, position: "右", name: "加藤 九郎" },
			{ battingOrder: 7, position: "捕", name: "吉田 十郎" },
			{ battingOrder: 8, position: "遊", name: "松本 十一" },
			{ battingOrder: 9, position: "投", name: "山田 太郎" },
		],
		battingResults: [
			{ position: "中", name: "佐藤 四郎", battingAverage: ".280", atBats: 4, hits: 2, rbi: 1, homeRuns: 1, stolenBases: 0, inningResults: ["中飛", "左安", "本塁打", "三振", "遊ゴロ", "", "右安"] },
			{ position: "二", name: "高橋 五郎", battingAverage: ".265", atBats: 3, hits: 1, rbi: 0, homeRuns: 0, stolenBases: 1, inningResults: ["四球", "二ゴロ", "", "中安", "三振", "", "遊飛"] },
			{ position: "左", name: "伊藤 六郎", battingAverage: ".310", atBats: 4, hits: 1, rbi: 2, homeRuns: 0, stolenBases: 0, inningResults: ["三振", "左飛", "中安", "", "遊ゴロ", "一ゴロ", ""] },
			{ position: "三", name: "渡辺 七郎", battingAverage: ".245", atBats: 3, hits: 0, rbi: 0, homeRuns: 0, stolenBases: 0, inningResults: ["遊ゴロ", "", "三振", "投ゴロ", "", "右飛", ""] },
			{ position: "一", name: "小林 八郎", battingAverage: ".230", atBats: 3, hits: 1, rbi: 1, homeRuns: 0, stolenBases: 0, inningResults: ["", "右安", "三振", "", "二ゴロ", "三振", ""] },
			{ position: "右", name: "加藤 九郎", battingAverage: ".198", atBats: 3, hits: 0, rbi: 0, homeRuns: 0, stolenBases: 0, inningResults: ["", "三振", "左飛", "", "遊ゴロ", "", "中飛"] },
			{ position: "捕", name: "吉田 十郎", battingAverage: ".255", atBats: 3, hits: 1, rbi: 1, homeRuns: 0, stolenBases: 0, inningResults: ["", "二ゴロ", "", "中安", "三振", "", "投ゴロ"] },
			{ position: "遊", name: "松本 十一", battingAverage: ".220", atBats: 3, hits: 0, rbi: 0, homeRuns: 0, stolenBases: 0, inningResults: ["", "三振", "", "遊ゴロ", "", "右飛", "一ゴロ"] },
			{ position: "投", name: "山田 太郎", battingAverage: ".100", atBats: 2, hits: 0, rbi: 0, homeRuns: 0, stolenBases: 0, inningResults: ["", "", "三振", "", "投ゴロ", "", ""] },
		],
		pitchingResults: [
			{
				name: "山田 太郎",
				inningsPitched: "6",
				hitsAllowed: 5,
				strikeouts: 4,
				runs: 2,
				earnedRuns: 2,
			},
			{
				name: "田中 三郎",
				inningsPitched: "1",
				hitsAllowed: 1,
				strikeouts: 1,
				runs: 1,
				earnedRuns: 1,
			},
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
		summary:
			"打線は奮闘するも投手陣が捕まり、10対20で敗戦。序盤から相手打線に捕まり、大量失点を喫した。打線は粘り強く反撃し10点を挙げたが、投手陣の乱調をカバーしきれなかった。",
		pitchers: {
			winningPitcher: "相手投手B",
			losingPitcher: "鈴木 次郎",
		},
		homeRuns: [
			{ playerName: "高橋 五郎", count: 2, description: "5号2ラン" },
			{ playerName: "伊藤 六郎", count: 1, description: "2号ソロ" },
		],
		duration: "3時間5分",
		participants: 16,
		startingLineup: [
			{ battingOrder: 1, position: "遊", name: "佐藤 四郎" },
			{ battingOrder: 2, position: "中", name: "高橋 五郎" },
			{ battingOrder: 3, position: "一", name: "伊藤 六郎" },
			{ battingOrder: 4, position: "三", name: "渡辺 七郎" },
			{ battingOrder: 5, position: "左", name: "小林 八郎" },
			{ battingOrder: 6, position: "右", name: "加藤 九郎" },
			{ battingOrder: 7, position: "捕", name: "吉田 十郎" },
			{ battingOrder: 8, position: "二", name: "松本 十一" },
			{ battingOrder: 9, position: "投", name: "鈴木 次郎" },
		],
		battingResults: [
			{ position: "遊", name: "佐藤 四郎", battingAverage: ".280", atBats: 4, hits: 1, rbi: 1, homeRuns: 0, stolenBases: 0, inningResults: ["遊ゴロ", "三振", "中安", "遊飛", "三振", "四球", "投ゴロ"] },
			{ position: "中", name: "高橋 五郎", battingAverage: ".265", atBats: 5, hits: 3, rbi: 4, homeRuns: 1, stolenBases: 1, inningResults: ["左安", "本塁打", "中飛", "右安", "三振", "左安", "遊ゴロ"] },
			{ position: "一", name: "伊藤 六郎", battingAverage: ".310", atBats: 4, hits: 2, rbi: 2, homeRuns: 1, stolenBases: 0, inningResults: ["三振", "中安", "本塁打", "", "左飛", "四球", "二ゴロ"] },
			{ position: "三", name: "渡辺 七郎", battingAverage: ".245", atBats: 4, hits: 1, rbi: 1, homeRuns: 0, stolenBases: 0, inningResults: ["二ゴロ", "遊ゴロ", "", "右安", "三振", "一ゴロ", "中飛"] },
			{ position: "左", name: "小林 八郎", battingAverage: ".230", atBats: 4, hits: 1, rbi: 0, homeRuns: 0, stolenBases: 0, inningResults: ["左飛", "", "三振", "遊ゴロ", "中安", "三振", ""] },
			{ position: "右", name: "加藤 九郎", battingAverage: ".198", atBats: 3, hits: 0, rbi: 1, homeRuns: 0, stolenBases: 0, inningResults: ["", "三振", "犠飛", "", "遊ゴロ", "右飛", "三振"] },
			{ position: "捕", name: "吉田 十郎", battingAverage: ".255", atBats: 4, hits: 2, rbi: 1, homeRuns: 0, stolenBases: 0, inningResults: ["", "左安", "三振", "中安", "", "遊ゴロ", "投ゴロ"] },
			{ position: "二", name: "松本 十一", battingAverage: ".220", atBats: 3, hits: 1, rbi: 0, homeRuns: 0, stolenBases: 0, inningResults: ["", "遊ゴロ", "", "三振", "右安", "", "中飛"] },
			{ position: "投", name: "鈴木 次郎", battingAverage: ".100", atBats: 2, hits: 0, rbi: 0, homeRuns: 0, stolenBases: 0, inningResults: ["", "", "三振", "", "投ゴロ", "", ""] },
		],
		pitchingResults: [
			{
				name: "鈴木 次郎",
				inningsPitched: "3",
				hitsAllowed: 8,
				strikeouts: 2,
				runs: 9,
				earnedRuns: 8,
			},
			{
				name: "中村 十二",
				inningsPitched: "2",
				hitsAllowed: 5,
				strikeouts: 1,
				runs: 6,
				earnedRuns: 6,
			},
			{
				name: "木村 十三",
				inningsPitched: "2",
				hitsAllowed: 4,
				strikeouts: 0,
				runs: 5,
				earnedRuns: 4,
			},
		],
	},
];

export const getGameById = (id: number): GameData | undefined => {
	return data.find((game) => game.id === id);
};
