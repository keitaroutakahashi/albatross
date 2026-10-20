import { getRecentCompletedEvents } from "@/app/_features/events/api/get-events";
import prisma from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  default: { event: { findMany: vi.fn() } },
}));

describe("getRecentCompletedEvents", () => {
  it("終了したイベントだけを、開催日が新しい順に、指定した件数だけ取得する", async () => {
    vi.mocked(prisma.event.findMany).mockResolvedValue([]);

    await getRecentCompletedEvents(3);

    expect(prisma.event.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { status: "completed" },
        orderBy: [{ date: "desc" }, { id: "desc" }],
        take: 3,
      }),
    );
  });

  it("開催日の条件を付けない（予定の有無にかかわらず、直近の終了分を返す）", async () => {
    vi.mocked(prisma.event.findMany).mockResolvedValue([]);

    await getRecentCompletedEvents(3);

    const args = vi.mocked(prisma.event.findMany).mock.calls[0]?.[0];
    expect(args?.where).not.toHaveProperty("date");
  });
});
