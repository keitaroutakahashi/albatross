import { act, render } from "@testing-library/react";
import { ScrollToTop } from "@/app/_components/ui/scroll-to-top";

const navigation = vi.hoisted(() => ({ pathname: "/events" }));

vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
}));

describe("ScrollToTop", () => {
  const scrollTo = vi.fn();

  beforeEach(() => {
    navigation.pathname = "/events";
    scrollTo.mockClear();
    window.scrollTo = scrollTo;
  });

  it("初回表示ではスクロールしない", () => {
    render(<ScrollToTop />);

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("パスが変わったら一番上へスクロールする", () => {
    const { rerender } = render(<ScrollToTop />);

    navigation.pathname = "/members";
    rerender(<ScrollToTop />);

    expect(scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  });

  it("戻る・進むによる遷移ではスクロールしない", () => {
    const { rerender } = render(<ScrollToTop />);

    act(() => {
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    navigation.pathname = "/members";
    rerender(<ScrollToTop />);

    expect(scrollTo).not.toHaveBeenCalled();
  });
});
