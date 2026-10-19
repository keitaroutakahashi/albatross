/**
 * ts-league の試合結果ページ（HTML）から、自チームの成績を JSON に変換する。
 * 空のセルも位置を保ったまま読むため、WebFetch の要約ではなく HTML を直接読む。
 *
 *   pnpm game:fetch '<試合結果ページの URL>' game.html
 *   pnpm game:parse game.html game.json '<試合結果ページの URL>'
 */
import { readFileSync, writeFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import type {
  ParsedAtBat,
  ParsedBatter,
  ParsedGame,
  ParsedPitcher,
} from "./ts-league/types";

// 自チームの ts-league 上の URL。チーム名の表記が変わっても、リンクで特定する
const TEAM_PATH = "/team/alba-tross/";
const MAX_INNINGS = 9;

const [htmlPath, outPath, sourceUrl] = process.argv.slice(2);
if (!htmlPath || !outPath) {
  console.error("使い方: pnpm game:parse <html> <out.json> [sourceUrl]");
  process.exit(1);
}

const { document } = new JSDOM(readFileSync(htmlPath, "utf-8")).window;

const text = (el: Element | null | undefined) =>
  (el?.textContent ?? "").replace(/\s+/g, "");

const toInt = (value: string, what: string): number => {
  const n = Number(value);
  if (value === "" || !Number.isInteger(n)) {
    throw new Error(`${what} が数値ではありません: "${value}"`);
  }
  return n;
};

const tables = [...document.querySelectorAll("table")];
const rowsOf = (table: HTMLTableElement) => [...table.rows];
const cellsOf = (row: HTMLTableRowElement) => [...row.cells];
const hasTeamLink = (el: Element) =>
  el.querySelector(`a[href^="${TEAM_PATH}"]`) !== null;
// 表の途中にある「先攻 / 後攻」のチーム見出し行を除く（先頭のセルが打順・登板順の数字の行だけ）
const isPlayerRow = (row: HTMLTableRowElement) =>
  hasTeamLink(row) && /^\d+$/.test(text(row.cells[0]));

/** 見出しの 1 つ目のセルで表を探す（見出しは改行で 1 文字ずつ分かれているため空白を除いて比べる） */
const findTables = (firstHeader: string) =>
  tables.filter((t) => text(t.rows[0]?.cells[0]) === firstHeader);

// 例: 【公式戦】2026年10月17日 …｜試合結果｜東京スカイツリーグ
const pageTitle = (document.title ?? "").trim();

/** 日付・時刻・会場 */
const dateBlock = document.querySelector("p.geam__dates");
if (!dateBlock) throw new Error("試合日時の欄が見つかりません");
const [dateLine = "", timeLine = "", venueLine = ""] = dateBlock.innerHTML
  .split(/<br\s*\/?>/i)
  .map((s) =>
    s
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim(),
  );
const dateMatch = dateLine.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
if (!dateMatch) throw new Error(`日付を読めません: ${dateLine}`);
const date = `${dateMatch[1]}-${String(dateMatch[2]).padStart(2, "0")}-${String(dateMatch[3]).padStart(2, "0")}`;
const timeMatch = timeLine.match(/(\d{1,2})\s*[：:]\s*(\d{2})/);
const time = timeMatch
  ? `${String(timeMatch[1]).padStart(2, "0")}:${timeMatch[2]}`
  : null;

/** スコアボード。上の行が先攻 */
const scoreboard = document.querySelector<HTMLTableElement>(
  "table.geam_score_graphs",
);
if (!scoreboard) throw new Error("スコアボードが見つかりません");
const boardRows = rowsOf(scoreboard);
const teamRowIndex = boardRows.findIndex((r) => hasTeamLink(r));
if (teamRowIndex === -1 || boardRows.length !== 2) {
  throw new Error("スコアボードから自チームの行を特定できません");
}
const teamRow = boardRows[teamRowIndex] as HTMLTableRowElement;
const opponentRow = boardRows[1 - teamRowIndex] as HTMLTableRowElement;
const opponent = text(opponentRow.querySelector("th"));

const inningCells = (row: HTMLTableRowElement) =>
  cellsOf(row)
    .slice(1, 1 + MAX_INNINGS)
    .map((c) => text(c));
const teamCells = inningCells(teamRow);
const opponentCells = inningCells(opponentRow);
// 後半の空セルは、行われなかったイニング
let inningCount = MAX_INNINGS;
while (
  inningCount > 0 &&
  teamCells[inningCount - 1] === "" &&
  opponentCells[inningCount - 1] === ""
) {
  inningCount -= 1;
}
// 後攻が裏の攻撃をしなかったイニング（サヨナラ・リード時）は「✕」と表記される。得点は 0 として扱う
const NOT_BATTED = /^[✕×xX]$/;
const inningScores = (cells: string[]) =>
  cells
    .slice(0, inningCount)
    .map((v, i) => (NOT_BATTED.test(v) ? 0 : toInt(v, `${i + 1}回の得点`)));
const totalOf = (row: HTMLTableRowElement) =>
  toInt(text(cellsOf(row).at(-1)), "合計得点");

/** 見出しと値の対応から、チーム成績の表の自チームの行を読む */
const teamTotalsRow = (headerKey: string): Record<string, string> => {
  const table = tables.find((t) =>
    cellsOf(t.rows[0] as HTMLTableRowElement).some((c) =>
      text(c).includes(headerKey),
    ),
  );
  if (!table) throw new Error(`チーム成績の表が見つかりません: ${headerKey}`);
  const headers = cellsOf(table.rows[0] as HTMLTableRowElement).map((c) =>
    text(c),
  );
  const row = rowsOf(table)
    .slice(1)
    .find((r) => hasTeamLink(r));
  if (!row) throw new Error(`自チームの行が見つかりません: ${headerKey}`);
  const cells = cellsOf(row).map((c) => text(c));
  if (cells.length !== headers.length) {
    throw new Error(`チーム成績の表の列数が合いません: ${headerKey}`);
  }
  return Object.fromEntries(headers.map((h, i) => [h, cells[i] ?? ""]));
};
const battingTotals = teamTotalsRow("打席数");
const pitchingTotals = teamTotalsRow("投球回");
const totalOfColumn = (row: Record<string, string>, key: string) =>
  toInt(row[key] ?? "", `チーム成績 ${key}`);

/** 打席結果の表記から、打点の括弧（例: 一ゴ(1)）を分ける */
const parseAtBat = (cell: string, inning: number): ParsedAtBat => {
  const m = cell.match(/^(.+?)\((\d+)\)$/);
  return m
    ? { inning, label: m[1] as string, rbi: Number(m[2]) }
    : { inning, label: cell, rbi: 0 };
};

const nameOf = (cell: HTMLTableCellElement) => {
  const link = text(cell.querySelector("a"));
  const m = link.match(/^(.+)\((\d+)\)$/);
  if (!m) throw new Error(`選手名を読めません: ${link}`);
  return { name: m[1] as string, uniformNumber: m[2] as string };
};

/** 打撃成績。列は 打順・写真・選手名・経験・OPS・打率・守備・打点・得点・盗塁・盗失・失策・美技・1回〜9回 */
const battingTable = findTables("打順").find((t) =>
  rowsOf(t).some(isPlayerRow),
);
if (!battingTable) throw new Error("自チームの打撃成績が見つかりません");
const batting: ParsedBatter[] = rowsOf(battingTable)
  .slice(1)
  .filter(isPlayerRow)
  .map((row) => {
    const cells = cellsOf(row);
    if (cells.length !== 13 + MAX_INNINGS) {
      throw new Error(`打撃成績の列数が想定と違います: ${cells.length}`);
    }
    const c = (i: number) => text(cells[i]);
    const atBats = cells
      .slice(13)
      .flatMap((cell, i) =>
        text(cell) === "" ? [] : [parseAtBat(text(cell), i + 1)],
      );
    return {
      order: toInt(c(0), "打順"),
      ...nameOf(cells[2] as HTMLTableCellElement),
      position: c(6),
      rbiColumn: toInt(c(7), "打点"),
      runsColumn: toInt(c(8), "得点"),
      stolenBases: toInt(c(9), "盗塁"),
      atBats,
    };
  });

/** 投手成績。列は 登板順・チーム・写真・選手名・経験・防御率・イニング・自責点・失点・奪三振・与四球・与死球・被安打・被本塁打・暴投・ボーク・勝敗 */
const pitching: ParsedPitcher[] = findTables("登板順")
  .flatMap((t) => rowsOf(t).slice(1))
  .filter(isPlayerRow)
  .map((row) => {
    const cells = cellsOf(row);
    if (cells.length !== 17) {
      throw new Error(`投手成績の列数が想定と違います: ${cells.length}`);
    }
    const c = (i: number) => text(cells[i]);
    return {
      order: toInt(c(0), "登板順"),
      ...nameOf(cells[3] as HTMLTableCellElement),
      inningsText: c(6),
      earnedRuns: toInt(c(7), "自責点"),
      runs: toInt(c(8), "失点"),
      strikeouts: toInt(c(9), "奪三振"),
      walks: toInt(c(10), "与四球"),
      hitByPitches: toInt(c(11), "与死球"),
      hitsAllowed: toInt(c(12), "被安打"),
      homeRunsAllowed: toInt(c(13), "被本塁打"),
      decision: c(16),
    };
  });

/**
 * 試合後のコメント。質問（見出し）と回答（段落）の組で、自チームのものを読む。
 * 枠のクラス名は勝敗で変わる（勝ち: win_cmt、負け: lose_cmt）ため、末尾の _cmt で探す
 */
const commentBlock = [...document.querySelectorAll('div[class$="_cmt"]')].find(
  (el) => hasTeamLink(el),
);
const comment: ParsedGame["comment"] = commentBlock
  ? {
      // チームへのリンク・写真のリンクに続く、最後のリンクが選手名
      author:
        [...commentBlock.querySelectorAll('[class$="_cmt_logos"] a')]
          .map((a) => text(a))
          .filter((t) => t !== "")
          .at(-1) ?? "",
      items: [...commentBlock.querySelectorAll("h6")].map((h) => ({
        question: (h.textContent ?? "").replace(/\s+/g, " ").trim(),
        answer: (h.nextElementSibling?.innerHTML ?? "")
          .replace(/<br\s*\/?>\s*/gi, "\n")
          .replace(/<[^>]*>/g, "")
          .trim(),
      })),
    }
  : null;

const game: ParsedGame = {
  sourceUrl: sourceUrl ?? null,
  date,
  time,
  venueText: venueLine,
  gameTypeText: pageTitle.match(/^【([^】]+)】/)?.[1] ?? "",
  leagueText: pageTitle.split("｜").at(-1)?.trim() ?? "",
  opponent,
  isFirstBatting: teamRowIndex === 0,
  innings: {
    team: inningScores(teamCells),
    opponent: inningScores(opponentCells),
    teamTotal: totalOf(teamRow),
    opponentTotal: totalOf(opponentRow),
  },
  teamTotals: {
    plateAppearances: totalOfColumn(battingTotals, "打席数"),
    runs: totalOfColumn(battingTotals, "得点"),
    hits: totalOfColumn(battingTotals, "安打"),
    rbi: totalOfColumn(battingTotals, "打点"),
    stolenBases: totalOfColumn(battingTotals, "盗塁"),
    errors: totalOfColumn(battingTotals, "失策"),
    pitching: {
      runs: totalOfColumn(pitchingTotals, "失点"),
      hitsAllowed: totalOfColumn(pitchingTotals, "被安打"),
      strikeouts: totalOfColumn(pitchingTotals, "奪三振"),
      walks: totalOfColumn(pitchingTotals, "与四球"),
      hitByPitches: totalOfColumn(pitchingTotals, "与死球"),
    },
  },
  batting,
  pitching,
  comment,
  summary: null,
};

writeFileSync(outPath, `${JSON.stringify(game, null, 2)}\n`);
console.log(
  `${date} vs ${opponent}: 打者 ${batting.length} 人 / 打席 ${batting.reduce((n, b) => n + b.atBats.length, 0)} / 投手 ${pitching.length} 人 -> ${outPath}`,
);
