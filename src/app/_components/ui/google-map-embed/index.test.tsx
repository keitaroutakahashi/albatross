import { render, screen } from "@testing-library/react";
import { GoogleMapEmbed } from "@/app/_components/ui/google-map-embed";

const EMBED_URL = "https://www.google.com/maps/embed?pb=1";

describe("GoogleMapEmbed", () => {
  it("埋め込み用の URL なら、決まった属性の iframe を表示する", () => {
    render(<GoogleMapEmbed url={EMBED_URL} title="代々木公園の地図" />);

    const frame = screen.getByTitle("代々木公園の地図");
    expect(frame).toHaveAttribute("src", EMBED_URL);
    expect(frame).toHaveAttribute("loading", "lazy");
    expect(frame).toHaveAttribute(
      "referrerpolicy",
      "no-referrer-when-downgrade",
    );
  });

  it("埋め込み用ではない URL は、何も表示しない", () => {
    const { container } = render(
      <GoogleMapEmbed url="https://example.com/" title="地図" />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
