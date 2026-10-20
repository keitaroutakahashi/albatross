import { render, screen } from "@testing-library/react";
import type { GameDetail } from "@/app/_features/games/api/get-games";
import { AIAnalysis } from "@/app/(public)/events/[id]/_components/game/ai-analysis";
import { BenchLineup } from "@/app/(public)/events/[id]/_components/game/bench-lineup";
import { GameInfo } from "@/app/(public)/events/[id]/_components/game/game-info";
import { GameResults } from "@/app/(public)/events/[id]/_components/game/game-results";
import { GameStats } from "@/app/(public)/events/[id]/_components/game/game-stats";
import { GameSummary } from "@/app/(public)/events/[id]/_components/game/game-summary";
import { ScoreBoard } from "@/app/(public)/events/[id]/_components/game/score-board";
import { StartingLineup } from "@/app/(public)/events/[id]/_components/game/starting-lineup";
import type { EventStatus } from "@/generated/prisma/enums";

vi.mock("next/image", () => ({
  // biome-ignore lint/performance/noImgElement: テスト用の置き換え
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

type MemberOverrides = {
  memberType?: "starting" | "bench";
  plateAppearances?: {
    result: string;
    inningNumber?: number;
    isScoringPosition?: boolean;
  }[];
  pitchingResult?: object | null;
  position?: string | null;
};

let nextId = 1;
const member = ({
  memberType = "starting",
  plateAppearances = [],
  pitchingResult = null,
  position = null,
}: MemberOverrides = {}) => {
  const id = nextId++;
  return {
    id,
    memberId: id,
    memberType,
    battingOrder: memberType === "starting" ? id : null,
    position,
    member: { name: `選手${id}`, uniformNumber: String(id) },
    plateAppearances: plateAppearances.map((pa) => ({
      inningNumber: 1,
      direction: null,
      rbi: 0,
      isScoringPosition: false,
      ...pa,
    })),
    pitchingResult,
  };
};

/** 各セクションが参照する項目だけを持つ試合。指定しない項目は「情報なし」の状態にする */
const gameOf = (status: EventStatus, overrides: Record<string, unknown> = {}) =>
  ({
    event: { status, note: null },
    opponent: { name: "テスト" },
    isFirstBatting: true,
    result: null,
    innings: [],
    mvps: [],
    gameMembers: [],
    ground: null,
    groundCourt: null,
    gameWeather: null,
    videoUrl: null,
    summary: null,
    aiGoodPoints: null,
    aiBadPoints: null,
    teamForfeitedRuns: 0,
    opponentForfeitedRuns: 0,
    ...overrides,
  }) as unknown as GameDetail;

describe("終了した試合は、情報があるものだけ表示する", () => {
  describe("ベンチ入りメンバー", () => {
    it("いなければ表示しない", () => {
      const { container } = render(<BenchLineup game={gameOf("completed")} />);
      expect(container).toBeEmptyDOMElement();
    });

    it("いれば表示する", () => {
      const game = gameOf("completed", {
        gameMembers: [member({ memberType: "bench" })],
      });
      render(<BenchLineup game={game} />);
      expect(screen.getByText("ベンチ入りメンバー")).toBeInTheDocument();
    });

    it("予定の試合は、いなくても枠を表示する", () => {
      render(<BenchLineup game={gameOf("scheduled")} />);
      expect(screen.getByText("ベンチ入りメンバー")).toBeInTheDocument();
    });
  });

  describe("スターティングメンバー", () => {
    it("いなければ表示しない", () => {
      const { container } = render(
        <StartingLineup game={gameOf("completed")} />,
      );
      expect(container).toBeEmptyDOMElement();
    });

    it("各選手の名前の後に背番号を表示する", () => {
      const game = gameOf("completed", {
        gameMembers: [member(), member()],
      });
      render(<StartingLineup game={game} />);

      for (const gm of game.gameMembers) {
        const name = screen.getByText(gm.member.name);
        expect(name.nextElementSibling).toHaveTextContent(
          `#${gm.member.uniformNumber}`,
        );
      }
    });

    it("予定の試合は、いなくても枠を表示する", () => {
      render(<StartingLineup game={gameOf("scheduled")} />);
      expect(screen.getByText("スターティングメンバー")).toBeInTheDocument();
    });
  });

  describe("戦評", () => {
    it("未入力や空白だけなら表示しない", () => {
      const empty = render(<GameSummary game={gameOf("completed")} />);
      expect(empty.container).toBeEmptyDOMElement();

      const blank = render(
        <GameSummary game={gameOf("completed", { summary: "  \n " })} />,
      );
      expect(blank.container).toBeEmptyDOMElement();
    });

    it("入力されていれば表示する", () => {
      render(<GameSummary game={gameOf("completed", { summary: "接戦" })} />);
      expect(screen.getByText("接戦")).toBeInTheDocument();
    });
  });

  describe("AI分析", () => {
    it("評価点・改善点のどちらもなければ表示しない", () => {
      const { container } = render(<AIAnalysis game={gameOf("completed")} />);
      expect(container).toBeEmptyDOMElement();
    });

    it("あるものだけ表示する", () => {
      const game = gameOf("completed", { aiGoodPoints: "守備が良かった" });
      render(<AIAnalysis game={game} />);
      expect(screen.getByText("評価点")).toBeInTheDocument();
      expect(screen.queryByText("改善点")).not.toBeInTheDocument();
    });
  });

  describe("スコアボード", () => {
    it("イニングの得点がなければ表示しない", () => {
      const { container } = render(<ScoreBoard game={gameOf("completed")} />);
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("チーム成績", () => {
    it("打席も投手成績もなければ表示しない", () => {
      const game = gameOf("completed", { gameMembers: [member()] });
      const { container } = render(<GameStats game={game} />);
      expect(container).toBeEmptyDOMElement();
    });

    it("投手成績がなければ、打者成績だけ表示する", () => {
      const game = gameOf("completed", {
        gameMembers: [member({ plateAppearances: [{ result: "single" }] })],
      });
      render(<GameStats game={game} />);
      expect(screen.getByText("打者成績")).toBeInTheDocument();
      expect(screen.queryByText("投手成績")).not.toBeInTheDocument();
    });
  });

  describe("チーム成績の得点圏打率", () => {
    const rispOf = (
      plateAppearances: { result: string; isScoringPosition?: boolean }[],
    ) => {
      render(
        <GameStats
          game={gameOf("completed", {
            gameMembers: [member({ plateAppearances })],
          })}
        />,
      );
      const headers = screen
        .getAllByRole("columnheader")
        .map((th) => th.textContent);
      const cells = screen.getAllByRole("cell").map((td) => td.textContent);
      return { headers, value: cells[headers.indexOf("得点圏打率")] };
    };

    it("出塁率の右隣に、得点圏打率の列がある", () => {
      const { headers } = rispOf([{ result: "single" }]);
      expect(headers.indexOf("得点圏打率")).toBe(headers.indexOf("出塁率") + 1);
    });

    it("得点圏の打数に対する安打の割合を表示する", () => {
      const { value } = rispOf([
        { result: "single", isScoringPosition: true },
        { result: "groundOut", isScoringPosition: true },
        // 得点圏でない打席は、分母にも分子にも入れない
        { result: "single" },
      ]);
      expect(value).toBe(".500");
    });

    it("得点圏の打数がなければ「-」を表示する", () => {
      const { value } = rispOf([{ result: "single" }]);
      expect(value).toBe("-");
    });

    it("得点圏の四死球は、打数に入れない", () => {
      const { value } = rispOf([
        { result: "walk", isScoringPosition: true },
        { result: "single", isScoringPosition: true },
      ]);
      expect(value).toBe("1.000");
    });
  });

  describe("個人成績", () => {
    it("投手成績がなければ、投手成績の項目を表示しない", () => {
      const game = gameOf("completed", {
        gameMembers: [member({ plateAppearances: [{ result: "single" }] })],
      });
      render(<GameResults game={game} />);
      expect(screen.getByText("打者成績")).toBeInTheDocument();
      expect(screen.queryByText("投手成績")).not.toBeInTheDocument();
    });
  });

  describe("得点圏の打席", () => {
    const withPlateAppearance = (isScoringPosition: boolean) =>
      gameOf("completed", {
        gameMembers: [
          member({
            plateAppearances: [{ result: "single", isScoringPosition }],
          }),
        ],
      });

    it("得点圏の打席には印が付き、凡例が出る", () => {
      render(<GameResults game={withPlateAppearance(true)} />);

      expect(screen.getByTitle("得点圏")).toBeInTheDocument();
      expect(screen.getByText("（得点圏）")).toBeInTheDocument();
      expect(screen.getByText(/得点圏での打席/)).toBeInTheDocument();
    });

    it("得点圏の打席がなければ、印も凡例も出ない", () => {
      render(<GameResults game={withPlateAppearance(false)} />);

      expect(screen.queryByTitle("得点圏")).not.toBeInTheDocument();
      expect(screen.queryByText(/得点圏での打席/)).not.toBeInTheDocument();
    });
  });

  describe("球数", () => {
    const pitchingResult = (
      pitchCount: number | null,
      inningsPitched: number,
      partialOuts: number | null = null,
    ) => ({
      pitchingOrder: 1,
      inningsPitched,
      partialOuts,
      pitchCount,
      earnedRuns: 0,
      runs: 0,
      strikeouts: 0,
      walks: 0,
      hitByPitches: 0,
      hitsAllowed: 0,
      homeRunsAllowed: 0,
      isResponsible: false,
    });
    const pitcherGame = (...results: ReturnType<typeof pitchingResult>[]) =>
      gameOf("completed", {
        gameMembers: results.map((pr) => member({ pitchingResult: pr })),
      });

    /** 見出しの列と同じ位置のセルの値を、指定した見出しの表から取り出す */
    const cellsOf = (firstHeader: string, header: string) => {
      const table = screen
        .getAllByRole("table")
        .find((t) => t.querySelector("th")?.textContent === firstHeader);
      const headers = [...(table?.querySelectorAll("th") ?? [])].map(
        (th) => th.textContent,
      );
      const index = headers.indexOf(header);
      return [...(table?.querySelectorAll("tbody tr") ?? [])].map(
        (row) => row.querySelectorAll("td")[index]?.textContent,
      );
    };

    it("各投手の欄に球数を表示し、未入力は「-」にする", () => {
      render(
        <GameResults
          game={pitcherGame(pitchingResult(45, 3), pitchingResult(null, 1))}
        />,
      );
      expect(cellsOf("投手名", "球数")).toEqual(["45", "-"]);
    });

    it("チーム成績に、1 イニングあたりの平均球数を表示する", () => {
      // 3 回 45 球 + 2 回 30 球 = 5 回 75 球 → 15.0 球/回
      render(
        <GameStats
          game={pitcherGame(pitchingResult(45, 3), pitchingResult(30, 2))}
        />,
      );
      expect(cellsOf("防御率", "球/回")).toEqual(["15.0"]);
    });

    it("球数が未入力の投手は、平均の計算から除く", () => {
      // 球数なしの 2 回を含めると 30÷3 = 10.0 になってしまう
      render(
        <GameStats
          game={pitcherGame(pitchingResult(30, 1), pitchingResult(null, 2))}
        />,
      );
      expect(cellsOf("防御率", "球/回")).toEqual(["30.0"]);
    });

    it("球数の入力が 1 つもなければ「-」を表示する", () => {
      render(<GameStats game={pitcherGame(pitchingResult(null, 3))} />);
      expect(cellsOf("防御率", "球/回")).toEqual(["-"]);
    });
  });

  describe("試合情報", () => {
    it("何も情報がなければ表示しない", () => {
      const { container } = render(<GameInfo game={gameOf("completed")} />);
      expect(container).toBeEmptyDOMElement();
    });

    it("情報のある項目だけ表示する", () => {
      const game = gameOf("completed", {
        gameMembers: [
          member({ plateAppearances: [{ result: "homeRun" }] }),
          member({ position: "catcher" }),
        ],
      });
      render(<GameInfo game={game} />);

      expect(screen.getByText("本塁打")).toBeInTheDocument();
      expect(screen.getByText("捕手")).toBeInTheDocument();
      expect(screen.queryByText("二塁打")).not.toBeInTheDocument();
      expect(screen.queryByText("三塁打")).not.toBeInTheDocument();
      expect(screen.queryByText("投手")).not.toBeInTheDocument();
      expect(screen.queryByText("会場未定")).not.toBeInTheDocument();
      expect(screen.queryByText("天候")).not.toBeInTheDocument();
      expect(screen.queryByText("MVP")).not.toBeInTheDocument();
    });

    it("予定の試合は、情報がなくても枠を表示する", () => {
      render(<GameInfo game={gameOf("scheduled")} />);
      expect(screen.getByText("二塁打")).toBeInTheDocument();
      expect(screen.getByText("会場未定")).toBeInTheDocument();
      expect(screen.getByText("MVP")).toBeInTheDocument();
    });
  });
});
