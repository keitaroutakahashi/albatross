import { isDevAuthBypass } from "@/lib/auth/dev-bypass";

describe("isDevAuthBypass", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("開発サーバーで AUTH_DISABLED_FOR_DEV=true のときだけ有効", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("AUTH_DISABLED_FOR_DEV", "true");
    expect(isDevAuthBypass()).toBe(true);
  });

  it("開発サーバーでも、環境変数がなければ無効（オプトイン）", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("AUTH_DISABLED_FOR_DEV", "");
    expect(isDevAuthBypass()).toBe(false);
  });

  it("true 以外の値は無効", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("AUTH_DISABLED_FOR_DEV", "1");
    expect(isDevAuthBypass()).toBe(false);
  });

  it("本番では、環境変数があっても無効（認証を有効のままにする）", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("AUTH_DISABLED_FOR_DEV", "true");
    expect(isDevAuthBypass()).toBe(false);
  });

  it("テスト環境でも、環境変数があっても無効", () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("AUTH_DISABLED_FOR_DEV", "true");
    expect(isDevAuthBypass()).toBe(false);
  });
});
