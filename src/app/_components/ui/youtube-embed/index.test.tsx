import { render, screen } from "@testing-library/react";
import { YouTubeEmbed } from "@/app/_components/ui/youtube-embed";

const PLAYER_QUERY = "autoplay=0&controls=1&playsinline=1";

describe("YouTubeEmbed", () => {
  it("共有用の短縮 URL でも、埋め込み用の URL で表示する", () => {
    render(<YouTubeEmbed url="https://youtu.be/5b3pysWf_Yk?si=abc" />);

    expect(screen.getByTitle("試合動画")).toHaveAttribute(
      "src",
      `https://www.youtube.com/embed/5b3pysWf_Yk?${PLAYER_QUERY}`,
    );
  });

  it("自動再生はせず、コントロールバーを表示する指定にする", () => {
    render(<YouTubeEmbed url="https://youtu.be/5b3pysWf_Yk" />);

    const frame = screen.getByTitle("試合動画");
    const src = new URL(frame.getAttribute("src") ?? "");
    expect(src.searchParams.get("autoplay")).toBe("0");
    expect(src.searchParams.get("controls")).toBe("1");
    expect(frame.getAttribute("allow")).not.toContain("autoplay");
  });

  it("開始位置は引き継ぐ", () => {
    render(<YouTubeEmbed url="https://youtu.be/5b3pysWf_Yk?t=90" />);

    expect(
      new URL(
        screen.getByTitle("試合動画").getAttribute("src") ?? "",
      ).searchParams.get("start"),
    ).toBe("90");
  });

  it("16:9 の比率で表示する（低いとコントロールバーが隠れる）", () => {
    render(<YouTubeEmbed url="https://youtu.be/5b3pysWf_Yk" />);

    expect(screen.getByTitle("試合動画")).toHaveClass("aspect-video");
  });

  it("width / height 属性を付けない（固定の高さが 16:9 より優先され、スマホで大きくなる）", () => {
    render(<YouTubeEmbed url="https://youtu.be/5b3pysWf_Yk" />);

    const frame = screen.getByTitle("試合動画");
    expect(frame).not.toHaveAttribute("width");
    expect(frame).not.toHaveAttribute("height");
  });

  it("YouTube の動画 URL でなければ、何も表示しない", () => {
    const { container } = render(<YouTubeEmbed url="https://example.com/" />);
    expect(container).toBeEmptyDOMElement();
  });
});
