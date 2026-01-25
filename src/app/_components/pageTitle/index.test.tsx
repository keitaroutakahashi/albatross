import { render, screen } from "@testing-library/react";
import { PageTitle } from "@/app/_components/pageTitle";

describe("PageTitle", () => {
  it("タイトルとサブタイトルが表示される", () => {
    render(<PageTitle title="GAME" subtitle="試合情報" />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("GAME");
    expect(screen.getByText("試合情報")).toBeInTheDocument();
  });

  it("異なるタイトルとサブタイトルを表示できる", () => {
    render(<PageTitle title="TEAM" subtitle="チーム情報" />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("TEAM");
    expect(screen.getByText("チーム情報")).toBeInTheDocument();
  });
});
