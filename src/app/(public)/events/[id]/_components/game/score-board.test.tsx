import { render, screen } from "@testing-library/react";
import type { GameDetail } from "@/app/_features/games/api/get-games";
import { ScoreBoard } from "@/app/(public)/events/[id]/_components/game/score-board";
import type { EventStatus } from "@/generated/prisma/enums";

// チームのロゴ画像。表示内容には関係しないため、単純な img に置き換える
vi.mock("next/image", () => ({
  // biome-ignore lint/performance/noImgElement: テスト用の置き換え
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

/** スコアボードが参照する項目だけを持つ試合。集計値が入っていても、未実施なら表示しないことを確かめるため値を入れる */
const gameOf = (status: EventStatus, innings: GameDetail["innings"] = []) =>
  ({
    event: { status },
    opponent: { name: "テスト" },
    isFirstBatting: true,
    innings,
    teamScore: 3,
    opponentScore: 7,
    teamHits: 4,
    opponentHits: 9,
    teamErrors: 1,
    opponentErrors: 2,
    teamForfeitedRuns: 0,
    opponentForfeitedRuns: 0,
  }) as unknown as GameDetail;

const inningHeaders = () =>
  screen
    .getAllByRole("columnheader")
    .map((th) => th.textContent)
    .filter((text) => /^\d+$/.test(text ?? ""));

const bodyCells = () =>
  screen
    .getAllByRole("row")
    .slice(1)
    .flatMap((row) =>
      [...row.querySelectorAll("td")].slice(1).map((td) => td.textContent),
    );

describe("ScoreBoard", () => {
  it.each(["scheduled", "canceled"] as const)(
    "%s の試合は、7 回まで表示し、得点・R・H・E をすべて「-」にする",
    (status) => {
      render(<ScoreBoard game={gameOf(status)} />);

      expect(inningHeaders()).toEqual(["1", "2", "3", "4", "5", "6", "7"]);
      // 7 回分 + R・H・E の 10 列 × 2 チーム
      const cells = bodyCells();
      expect(cells).toHaveLength(20);
      expect(cells.every((text) => text === "-")).toBe(true);
    },
  );

  it("終了した試合は、入力済みのイニングと集計値を表示する", () => {
    const innings = [
      { id: 1, inningNumber: 1, teamScore: 2, opponentScore: 0 },
      { id: 2, inningNumber: 2, teamScore: 1, opponentScore: 7 },
    ] as unknown as GameDetail["innings"];
    render(<ScoreBoard game={gameOf("completed", innings)} />);

    expect(inningHeaders()).toEqual(["1", "2"]);
    expect(bodyCells()).toContain("9");
    expect(bodyCells()).not.toEqual(bodyCells().map(() => "-"));
  });

  it("先攻の行に自チーム、後攻の行に相手のイニング得点を表示する", () => {
    const innings = [
      { id: 1, inningNumber: 1, teamScore: 2, opponentScore: 0 },
      { id: 2, inningNumber: 2, teamScore: 1, opponentScore: 7 },
    ] as unknown as GameDetail["innings"];
    render(<ScoreBoard game={gameOf("completed", innings)} />);

    // 1 チームあたり、1・2 回の得点 + R・H・E の 5 列
    const cells = bodyCells();
    expect(cells.slice(0, 2)).toEqual(["2", "1"]);
    expect(cells.slice(5, 7)).toEqual(["0", "7"]);
  });
});
