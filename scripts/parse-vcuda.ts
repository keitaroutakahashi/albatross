/**
 * vcuda の試合結果ページ（HTML）から、自チームの成績を JSON（ParsedGame）に変換する。
 * 守備位置・勝敗は画像で表示されているため、画像の path から読む。
 *
 *   pnpm game:fetch:vcuda '<試合結果ページの URL>' game.html
 *   pnpm game:parse:vcuda game.html game.json '<試合結果ページの URL>'
 */
import { readFileSync, writeFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import type {
  ParsedAtBat,
  ParsedBatter,
  ParsedGame,
  ParsedPitcher,
} from "./game-import/types";

// 自チームの vcuda 上のチーム名。チーム ID はこの名前のスコアボードの行から特定する
const TEAM_NAME = "Albatross";
// リーグ戦のページしか対象にしないため、試合種別は公式戦で固定する（ページに表記が無い）
const GAME_TYPE_TEXT = "公式戦";
// 打撃表の列は 打順・守備・選手名・1〜n回・打席・打数・安打・得点・打点・盗塁・失策・盗塁許・盗塁刺
const LEADING_COLUMNS = 3;
const TRAILING_COLUMNS = 9;
// 勝敗の画像のファイル名（icon_win.png など）→ 勝敗の表記
const DECISIONS: Record<string, string> = { win: "勝", lose: "負" };
// 守備位置の画像のファイル名（box1.gif など）→ 元ページの守備位置の表記（import 側の POSITIONS のキー）
const POSITION_BY_BOX: Record<string, string> = {
  "1": "投",
  "2": "捕",
  "3": "一",
  "4": "二",
  "5": "三",
  "6": "遊",
  "7": "左",
  "8": "中",
  "9": "右",
  dh: "DH",
};

const [htmlPath, outPath, sourceUrl] = process.argv.slice(2);
if (!htmlPath || !outPath || !sourceUrl) {
  console.error("使い方: pnpm game:parse:vcuda <html> <out.json> <sourceUrl>");
  process.exit(1);
}
const gid = new URL(sourceUrl).searchParams.get("gid");
if (!gid) throw new Error("URL に gid がありません");

const { document } = new JSDOM(readFileSync(htmlPath, "utf-8")).window;

const text = (el: Element | null | undefined) =>
  (el?.textContent ?? "").replace(/\s+/g, "");

const toInt = (value: string, what: string): number => {
  // 空のセルは 0 として扱う（打点・得点・盗塁の列）
  if (value === "") return 0;
  const n = Number(value);
  if (!Number.isInteger(n)) {
    throw new Error(`${what} が数値ではありません: "${value}"`);
  }
  return n;
};

const tables = [...document.querySelectorAll("table")];
const rowsOf = (table: HTMLTableElement) => [...table.rows];
const cellsOf = (row: HTMLTableRowElement) => [...row.cells];
const teamIdOf = (el: Element) =>
  el
    .querySelector('a[href*="vw_teaminfo.php"]')
    ?.getAttribute("href")
    ?.match(/tid=(\d+)/)?.[1];
const logoTeamId = (cell: HTMLTableCellElement | undefined) =>
  cell
    ?.querySelector("img")
    ?.getAttribute("src")
    ?.match(/logo_tid_(\d+)/)?.[1];
/** 画像の path のファイル名から、拡張子・接頭辞（box、icon_）を除いた値を返す */
const imageKey = (cell: HTMLTableCellElement | undefined, prefix: string) =>
  cell
    ?.querySelector("img")
    ?.getAttribute("src")
    ?.match(new RegExp(`${prefix}([^/.]+)\\.\\w+$`))?.[1];

/** スコアボード。行の先頭セルのリンクがチーム ID */
const scoreboard = document.querySelector<HTMLTableElement>("table.scboard");
if (!scoreboard) throw new Error("スコアボードが見つかりません");
const boardRows = rowsOf(scoreboard).slice(1);
if (boardRows.length !== 2) {
  throw new Error("スコアボードの行が 2 行ではありません");
}
// チーム名は空白を含みうる（NAVY BLITZ）ので、空白を詰めずに連続を 1 つにする
const nameOfRow = (row: HTMLTableRowElement) =>
  (row.cells[1]?.textContent ?? "").replace(/\s+/g, " ").trim();
const teamRow = boardRows.find((r) => nameOfRow(r) === TEAM_NAME);
if (!teamRow) throw new Error(`スコアボードに ${TEAM_NAME} がありません`);
const opponentRow = boardRows.find((r) => r !== teamRow) as HTMLTableRowElement;
const teamId = teamIdOf(teamRow);
const opponentId = teamIdOf(opponentRow);
if (!teamId || !opponentId) throw new Error("チーム ID を読めません");

// 後攻が裏の攻撃をしなかったイニングは「✕」と表記される。得点は 0 として扱う
const NOT_BATTED = /^[✕×xX]$/;
const inningScores = (row: HTMLTableRowElement) =>
  cellsOf(row)
    .slice(2, -1)
    .map((c, i) =>
      NOT_BATTED.test(text(c)) ? 0 : toInt(text(c), `${i + 1}回の得点`),
    );
const totalOf = (row: HTMLTableRowElement) =>
  toInt(text(cellsOf(row).at(-1)), "合計得点");

/** 先攻/後攻は、一覧の該当する試合の行の「先」「後」のロゴで決める */
const listRow = rowsOf(tables[0] as HTMLTableElement).find((r) =>
  [...r.querySelectorAll("a")].some((a) =>
    new RegExp(`[?&]gid=${gid}(?!\\d)`).test(a.getAttribute("href") ?? ""),
  ),
);
if (!listRow) throw new Error(`一覧に gid=${gid} の試合がありません`);
const firstId = logoTeamId(listRow.cells[2]);
const secondId = logoTeamId(listRow.cells[4]);
if (
  !(
    (firstId === teamId && secondId === opponentId) ||
    (firstId === opponentId && secondId === teamId)
  )
) {
  throw new Error("一覧の先攻・後攻のチームがスコアボードと合いません");
}

/** 大会・日時・球場・内容（チーム談話）の表 */
const infoTable = tables.find((t) => text(t.rows[0]?.cells[0]) === "大会");
if (!infoTable) throw new Error("試合情報の表が見つかりません");
const infoCell = (key: string) =>
  rowsOf(infoTable).find((r) => text(r.cells[0]) === key)?.cells[1];
const infoText = (key: string) =>
  (infoCell(key)?.textContent ?? "").replace(/\s+/g, " ").trim();

const dateLine = infoText("日時");
const dateMatch = dateLine.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
if (!dateMatch) throw new Error(`日付を読めません: ${dateLine}`);
const date = `${dateMatch[1]}-${String(dateMatch[2]).padStart(2, "0")}-${String(dateMatch[3]).padStart(2, "0")}`;
const timeMatch = dateLine.match(/開始[：:]\s*(\d{1,2})時(\d{1,2})分/);
const time = timeMatch
  ? `${String(timeMatch[1]).padStart(2, "0")}:${String(timeMatch[2]).padStart(2, "0")}`
  : null;

/** チーム談話。内容の欄は「チーム談話」の見出しに続く本文 */
const commentBody = (infoCell("内容")?.innerHTML ?? "")
  .replace(/<br\s*\/?>\s*/gi, "\n")
  .replace(/<[^>]*>/g, "")
  .replace(/^\s*チーム談話/, "")
  .trim();

const CIRCLED = "①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳";
const MARKS = /^([^①-⑳●s]+)([①-⑳])?(●)?(s{1,2})?$/;
type ParsedCell = ParsedAtBat & { scored: boolean; steals: number };
/** 打席のセル（例: 右三①●、二失●s）を、結果・打点（①）・得点（●）・盗塁（s）に分ける */
const parseAtBat = (cell: string, inning: number): ParsedCell => {
  const m = cell.match(MARKS);
  if (!m) throw new Error(`打席の表記を読めません: "${cell}"`);
  return {
    inning,
    label: m[1] as string,
    rbi: m[2] ? CIRCLED.indexOf(m[2]) + 1 : 0,
    scored: m[3] !== undefined,
    steals: m[4]?.length ?? 0,
  };
};

/** 打撃表・投手表は、直前のチーム見出し（ロゴのリンクだけの表）のチームのもの */
const tablesByTeam = new Map<
  string,
  { batting?: HTMLTableElement; pitching?: HTMLTableElement }
>();
let currentTeamId: string | undefined;
for (const t of tables) {
  if (t.classList.contains("noborder")) {
    currentTeamId = teamIdOf(t) ?? currentTeamId;
    continue;
  }
  const header = text(t.rows[0]?.cells[0]);
  if (!currentTeamId || (header !== "打順" && header !== "投手名")) continue;
  const entry = tablesByTeam.get(currentTeamId) ?? {};
  if (header === "打順") entry.batting = t;
  else entry.pitching = t;
  tablesByTeam.set(currentTeamId, entry);
}
const teamTables = tablesByTeam.get(teamId);
const opponentTables = tablesByTeam.get(opponentId);
if (!teamTables?.batting || !teamTables.pitching) {
  throw new Error("自チームの打撃成績・投手成績が見つかりません");
}

const playerIdOf = (cell: HTMLTableCellElement | undefined) =>
  cell
    ?.querySelector("a")
    ?.getAttribute("href")
    ?.match(/pid=(\d+)/)?.[1];

/** 打撃表の選手の行（先頭が打順の数字の行。合計の行は除く） */
const playerRows = (table: HTMLTableElement) =>
  rowsOf(table)
    .slice(1)
    .filter((r) => /^\d+$/.test(text(r.cells[0])));
const totalRowOf = (table: HTMLTableElement) =>
  rowsOf(table).find((r) => text(r.cells[0]) === "合計");

const readCells = (row: HTMLTableRowElement) => {
  const cells = cellsOf(row);
  const inningCount = cells.length - LEADING_COLUMNS - TRAILING_COLUMNS;
  if (inningCount < 1) {
    throw new Error(`打撃成績の列数が想定と違います: ${cells.length}`);
  }
  return cells
    .slice(LEADING_COLUMNS, LEADING_COLUMNS + inningCount)
    .flatMap((cell, i) =>
      text(cell) === "" ? [] : [parseAtBat(text(cell), i + 1)],
    );
};

let stealMarks = 0;
const batting: ParsedBatter[] = playerRows(teamTables.batting).map((row) => {
  const cells = cellsOf(row);
  const atBats = readCells(row);
  const stats = cells.slice(-TRAILING_COLUMNS).map((c) => text(c));
  const box = imageKey(cells[1], "box_?");
  const position = box ? POSITION_BY_BOX[box] : undefined;
  if (!position) throw new Error(`${text(cells[2])}: 守備位置を読めません`);
  stealMarks += atBats.reduce((n, a) => n + a.steals, 0);
  return {
    order: toInt(text(cells[0]), "打順"),
    name: text(cells[2]),
    uniformNumber: "",
    sourcePlayerId: playerIdOf(cells[2]),
    position,
    rbiColumn: toInt(stats[4] as string, "打点"),
    runsColumn: toInt(stats[3] as string, "得点"),
    stolenBases: toInt(stats[5] as string, "盗塁"),
    atBats: atBats.map(({ inning, label, rbi }) => ({ inning, label, rbi })),
  };
});
const stolenBasesColumn = batting.reduce((n, b) => n + b.stolenBases, 0);
if (stealMarks !== stolenBasesColumn) {
  console.warn(
    `盗塁: 打席の表記（s）の合計 ${stealMarks} と盗塁の列の合計 ${stolenBasesColumn} が違います`,
  );
}

/** 投手表。列は 投手名・投球回数・自責点・失点・奪三振・四球・死球・被安打・被本打・勝敗（画像）。登板順は行の順 */
const pitching: ParsedPitcher[] = rowsOf(teamTables.pitching)
  .slice(1)
  .filter((r) => r.querySelector("a") !== null)
  .map((row, i) => {
    const cells = cellsOf(row);
    if (cells.length !== 10) {
      throw new Error(`投手成績の列数が想定と違います: ${cells.length}`);
    }
    const c = (n: number) => text(cells[n]);
    // 勝敗は画像（icon_win / icon_lose）。画像が無ければ列の文字を使う
    const decisionKey = imageKey(cells[9], "icon_");
    return {
      order: i + 1,
      name: c(0),
      uniformNumber: "",
      sourcePlayerId: playerIdOf(cells[0]),
      inningsText: c(1),
      earnedRuns: toInt(c(2), "自責点"),
      runs: toInt(c(3), "失点"),
      strikeouts: toInt(c(4), "奪三振"),
      walks: toInt(c(5), "四球"),
      hitByPitches: toInt(c(6), "死球"),
      hitsAllowed: toInt(c(7), "被安打"),
      homeRunsAllowed: toInt(c(8), "被本打"),
      decision: decisionKey ? (DECISIONS[decisionKey] ?? decisionKey) : c(9),
    };
  });

/**
 * 相手の打撃表から、自チームの投手成績の合計と失策を求める（独立した情報源として突き合わせに使う）。
 * 失策は、相手の打者が自チームの失策で出塁した打席（「○失」）の数
 */
const totalsOf = (table: HTMLTableElement) => {
  const row = totalRowOf(table);
  if (!row) throw new Error("打撃成績の合計の行が見つかりません");
  const v = cellsOf(row)
    .slice(-TRAILING_COLUMNS)
    .map((c) => text(c));
  return {
    plateAppearances: toInt(v[0] as string, "打席"),
    hits: toInt(v[2] as string, "安打"),
    runs: toInt(v[3] as string, "得点"),
    rbi: toInt(v[4] as string, "打点"),
    stolenBases: toInt(v[5] as string, "盗塁"),
    errors: toInt(v[6] as string, "失策"),
  };
};
const teamTotals = totalsOf(teamTables.batting);

const opponentLabels = opponentTables?.batting
  ? playerRows(opponentTables.batting).flatMap((r) =>
      readCells(r).map((a) => a.label),
    )
  : null;
const countLabels = (pattern: RegExp) =>
  (opponentLabels ?? []).filter((l) => pattern.test(l)).length;
const opponentTotals = opponentTables?.batting
  ? totalsOf(opponentTables.batting)
  : null;
if (!opponentLabels || !opponentTotals) {
  throw new Error("相手の打撃成績が見つかりません");
}

const game: ParsedGame = {
  sourceUrl,
  date,
  time,
  venueText: infoText("球場"),
  gameTypeText: GAME_TYPE_TEXT,
  // 「2026年度 千葉サタデーリーグ」の年度を除いたものをリーグ名とする
  leagueText: infoText("大会").replace(/^\d{4}年度\s*/, ""),
  opponent: nameOfRow(opponentRow),
  isFirstBatting: firstId === teamId,
  innings: {
    team: inningScores(teamRow),
    opponent: inningScores(opponentRow),
    teamTotal: totalOf(teamRow),
    opponentTotal: totalOf(opponentRow),
  },
  teamTotals: {
    plateAppearances: teamTotals.plateAppearances,
    runs: teamTotals.runs,
    hits: teamTotals.hits,
    rbi: teamTotals.rbi,
    stolenBases: teamTotals.stolenBases,
    errors: teamTotals.errors,
    pitching: {
      runs: opponentTotals.runs,
      hitsAllowed: opponentTotals.hits,
      strikeouts: countLabels(/^三振$/),
      walks: countLabels(/^四球$/),
      hitByPitches: countLabels(/^死球$/),
    },
  },
  teamErrorsFromOpponentBatting: countLabels(/^[一二三遊左中右投捕]失$/),
  batting,
  pitching,
  comment: commentBody
    ? {
        author: "",
        items: [{ question: "チーム談話", answer: commentBody }],
      }
    : null,
  summary: null,
};

writeFileSync(outPath, `${JSON.stringify(game, null, 2)}\n`);
console.log(
  `${date} vs ${game.opponent}: 打者 ${batting.length} 人 / 打席 ${batting.reduce((n, b) => n + b.atBats.length, 0)} / 投手 ${pitching.length} 人 -> ${outPath}`,
);
