import { shouldStartProgress } from "@/app/_components/ui/navigation-progress/should-start-progress";

const base = {
  defaultPrevented: true,
  button: 0,
  hasModifier: false,
  target: null,
  isDownload: false,
  href: "https://example.com/events/3",
  currentUrl: "https://example.com/events",
};

describe("shouldStartProgress", () => {
  it("サイト内の別ページへのクライアント遷移では出す", () => {
    expect(shouldStartProgress(base)).toBe(true);
  });

  it("クエリだけが変わる遷移でも出す（URL が変わるため、完了を検知できる）", () => {
    expect(
      shouldStartProgress({
        ...base,
        href: "https://example.com/events?season=2025",
        currentUrl: "https://example.com/events",
      }),
    ).toBe(true);
  });

  it("同じページへのリンクでは出さない（URL が変わらず、消えなくなるため）", () => {
    expect(
      shouldStartProgress({
        ...base,
        href: "https://example.com/events",
        currentUrl: "https://example.com/events",
      }),
    ).toBe(false);
  });

  it("ハッシュだけが変わる移動では出さない", () => {
    expect(
      shouldStartProgress({
        ...base,
        href: "https://example.com/events#list",
        currentUrl: "https://example.com/events",
      }),
    ).toBe(false);
  });

  it("別のサイトへのリンクでは出さない", () => {
    expect(
      shouldStartProgress({ ...base, href: "https://other.example.org/" }),
    ).toBe(false);
  });

  it("Link が処理していない（ブラウザ標準の遷移になる）クリックでは出さない", () => {
    expect(shouldStartProgress({ ...base, defaultPrevented: false })).toBe(
      false,
    );
  });

  it("修飾キー付き・左クリック以外・別タブ・ダウンロードでは出さない", () => {
    expect(shouldStartProgress({ ...base, hasModifier: true })).toBe(false);
    expect(shouldStartProgress({ ...base, button: 1 })).toBe(false);
    expect(shouldStartProgress({ ...base, target: "_blank" })).toBe(false);
    expect(shouldStartProgress({ ...base, isDownload: true })).toBe(false);
  });

  it("target が _self なら出す", () => {
    expect(shouldStartProgress({ ...base, target: "_self" })).toBe(true);
  });

  it("href がなければ出さない", () => {
    expect(shouldStartProgress({ ...base, href: null })).toBe(false);
  });
});
