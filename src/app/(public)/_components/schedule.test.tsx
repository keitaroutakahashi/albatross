import { render, screen } from "@testing-library/react";
import { getRecentCompletedEvents } from "@/app/_features/events/api/get-events";
import { Schedule } from "@/app/(public)/_components/schedule";

vi.mock("@/app/_features/events/api/get-events", () => ({
  getRecentCompletedEvents: vi.fn(),
}));

const gameEvent = (id: number, opponent: string) => ({
  id,
  date: new Date("2026-10-17T04:00:00Z"),
  game: { league: null, opponent: { name: opponent }, ground: null },
  practice: null,
});

describe("Schedule", () => {
  it("終了した直近 3 件を取得して、すべて表示する", async () => {
    vi.mocked(getRecentCompletedEvents).mockResolvedValue([
      gameEvent(3, "A"),
      gameEvent(2, "B"),
      gameEvent(1, "C"),
    ] as never);

    render(await Schedule());

    expect(getRecentCompletedEvents).toHaveBeenCalledWith(3);
    expect(screen.getByText("vs A")).toBeInTheDocument();
    expect(screen.getByText("vs B")).toBeInTheDocument();
    expect(screen.getByText("vs C")).toBeInTheDocument();
    expect(screen.getByText("EVENT")).toBeInTheDocument();
  });

  it("終了したイベントが 1 件もなければ表示しない", async () => {
    vi.mocked(getRecentCompletedEvents).mockResolvedValue([]);

    const { container } = render(await Schedule());

    expect(container).toBeEmptyDOMElement();
  });
});
