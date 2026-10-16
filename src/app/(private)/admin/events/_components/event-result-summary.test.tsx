import { render, screen } from "@testing-library/react";
import { EventResultSummary } from "@/app/(private)/admin/events/_components/event-result-summary";

const game = {
  teamScore: 3,
  opponentScore: 1,
  teamForfeitedRuns: null,
  opponentForfeitedRuns: null,
  teamHits: 5,
  opponentHits: 4,
  teamErrors: 0,
  opponentErrors: 2,
};

describe("EventResultSummary", () => {
  it("自チームの列は Albatross と表示する", () => {
    render(
      <EventResultSummary
        opponentName="世田谷ウィングス"
        isFirstBatting={null}
        game={game}
      />,
    );
    expect(screen.getByText("Albatross")).toBeInTheDocument();
    expect(screen.getByText("世田谷ウィングス")).toBeInTheDocument();
    expect(screen.queryByText("自チーム")).not.toBeInTheDocument();
  });

  it("献上点がなければ、献上点と合計の行を出さない", () => {
    render(
      <EventResultSummary
        opponentName={null}
        isFirstBatting={null}
        game={game}
      />,
    );
    expect(screen.queryByText("献上点")).not.toBeInTheDocument();
    expect(screen.queryByText("合計")).not.toBeInTheDocument();
    expect(screen.getByText("得点")).toBeInTheDocument();
  });

  it("献上点が 0 でも、どちらにもなければ出さない", () => {
    render(
      <EventResultSummary
        opponentName={null}
        isFirstBatting={null}
        game={{ ...game, teamForfeitedRuns: 0, opponentForfeitedRuns: 0 }}
      />,
    );
    expect(screen.queryByText("献上点")).not.toBeInTheDocument();
  });

  it("どちらかに献上点があれば、献上点と合計の行を出す", () => {
    render(
      <EventResultSummary
        opponentName={null}
        isFirstBatting={null}
        game={{ ...game, teamForfeitedRuns: 2 }}
      />,
    );
    expect(screen.getByText("献上点")).toBeInTheDocument();
    expect(screen.getByText("合計")).toBeInTheDocument();
  });

  it("後攻のときは、自チームを右の列にする", () => {
    render(
      <EventResultSummary
        opponentName="世田谷ウィングス"
        isFirstBatting={false}
        game={game}
      />,
    );
    const headers = ["世田谷ウィングス", "Albatross"].map((name) =>
      screen.getByText(name),
    );
    expect(
      headers[0].compareDocumentPosition(headers[1]) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});
