/** parse-ts-league.ts が出力し、import-ts-league.ts が読み込む JSON の形 */

export type ParsedAtBat = {
  /** 何回の打席か（元ページの「1回〜9回」列の位置） */
  inning: number;
  /** 元ページの表記から打点の括弧を除いたもの（例: 一ゴ、中安、中本） */
  label: string;
  rbi: number;
};

export type ParsedBatter = {
  order: number;
  name: string;
  uniformNumber: string;
  /** 元ページの守備位置の表記（中、左、DH など） */
  position: string;
  /** 元ページの個人成績の列の値。元ページ自体の整合性の確認に使う */
  rbiColumn: number;
  runsColumn: number;
  stolenBases: number;
  atBats: ParsedAtBat[];
};

export type ParsedPitcher = {
  order: number;
  name: string;
  uniformNumber: string;
  /** 元ページの表記（例: 2回0/3） */
  inningsText: string;
  earnedRuns: number;
  runs: number;
  strikeouts: number;
  walks: number;
  hitByPitches: number;
  hitsAllowed: number;
  homeRunsAllowed: number;
  /** 勝敗の列。空なら空文字 */
  decision: string;
};

export type ParsedGame = {
  sourceUrl: string | null;
  /** JST の試合日 (YYYY-MM-DD) */
  date: string;
  time: string | null;
  /** 会場の表記（例: 福栄スポーツ広場野球場B面(南行徳)野球場） */
  venueText: string;
  /** 試合種別の表記（例: 公式戦） */
  gameTypeText: string;
  /** リーグ名の表記（例: 東京スカイツリーグ） */
  leagueText: string;
  opponent: string;
  isFirstBatting: boolean;
  /** 自チームの献上点。元ページの「+3」のようにイニングの外で加算される得点で、パーサは読まないため JSON に手で書く */
  teamForfeitedRuns?: number;
  innings: {
    team: number[];
    opponent: number[];
    teamTotal: number;
    opponentTotal: number;
  };
  /** チーム成績の表の値。個人成績の合計との突き合わせに使う */
  teamTotals: {
    plateAppearances: number;
    runs: number;
    hits: number;
    rbi: number;
    stolenBases: number;
    /** 自チームの失策（守備） */
    errors: number;
    pitching: {
      runs: number;
      hitsAllowed: number;
      strikeouts: number;
      walks: number;
      hitByPitches: number;
    };
  };
  /** 相手の打撃成績にある「○失」の数。自チームの失策数として使う。相手の打撃成績がないページでは null */
  teamErrorsFromOpponentBatting: number | null;
  batting: ParsedBatter[];
  pitching: ParsedPitcher[];
  /** 自チームの「試合後のコメント」。ないときは null */
  comment: {
    /** コメントした選手（例: 菅原(51)） */
    author: string;
    items: { question: string; answer: string }[];
  } | null;
  /** 戦評。コメントを要約して手で入れる。パーサーは null で出力し、null のままなら戦評は書き込まない */
  summary: string | null;
};
