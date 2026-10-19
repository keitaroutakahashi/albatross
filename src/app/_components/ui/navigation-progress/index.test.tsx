import { act, render } from "@testing-library/react";
import { NavigationProgress } from "@/app/_components/ui/navigation-progress";

const navigation = vi.hoisted(() => ({
  pathname: "/events",
  search: "",
}));

vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
  useSearchParams: () => new URLSearchParams(navigation.search),
}));

const isVisible = (container: HTMLElement) =>
  container.firstElementChild?.classList.contains("opacity-100") ?? false;

/** next/link のクライアント遷移と同じく、クリックを preventDefault するリンクを置いてクリックする */
const clickLink = (href: string) => {
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.addEventListener("click", (e) => e.preventDefault());
  document.body.append(anchor);
  act(() => {
    anchor.click();
  });
  anchor.remove();
};

describe("NavigationProgress", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    navigation.pathname = "/events";
    navigation.search = "";
    window.history.replaceState(null, "", "/events");
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  it("何もしていないときは出ない", () => {
    const { container } = render(<NavigationProgress />);
    expect(isVisible(container)).toBe(false);
  });

  it("リンクをクリックしたら、すぐに出る（速い遷移でも見える）", () => {
    const { container } = render(<NavigationProgress />);
    clickLink("/events/3");
    expect(isVisible(container)).toBe(true);
  });

  it("URL が変わっても、最低限の時間は表示してから消える", () => {
    const { container, rerender } = render(<NavigationProgress />);
    clickLink("/events/3");

    navigation.pathname = "/events/3";
    rerender(<NavigationProgress />);
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(isVisible(container)).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(isVisible(container)).toBe(false);
  });

  it("URL が変わったあとも、読み込み中の表示（aria-busy）が残っている間は続く", async () => {
    const { container, rerender } = render(<NavigationProgress />);
    const skeleton = document.createElement("div");
    skeleton.setAttribute("aria-busy", "true");
    document.body.append(skeleton);

    clickLink("/events/3");
    navigation.pathname = "/events/3";
    rerender(<NavigationProgress />);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(isVisible(container)).toBe(true);

    // データの読み込みが終わり、スケルトンが消えたら完了する
    await act(async () => {
      skeleton.remove();
      await Promise.resolve();
      vi.advanceTimersByTime(1000);
    });
    expect(isVisible(container)).toBe(false);
  });

  it("URL が変わらないクリック（同じページへのリンク）では出ない", () => {
    const { container } = render(<NavigationProgress />);
    clickLink("/events");
    expect(isVisible(container)).toBe(false);
  });

  it("完了を検知できなくても、一定時間で消える", () => {
    const { container } = render(<NavigationProgress />);
    clickLink("/events/3");
    act(() => {
      vi.advanceTimersByTime(20_000);
    });
    expect(isVisible(container)).toBe(false);
  });
});
