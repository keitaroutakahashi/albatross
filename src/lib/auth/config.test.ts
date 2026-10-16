import { getWebAuthnConfig } from "@/lib/auth/config";

describe("getWebAuthnConfig", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("開発では未設定でも localhost で動く", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("WEBAUTHN_ORIGIN", "");
    vi.stubEnv("WEBAUTHN_RP_ID", "");
    // 空文字は未設定として扱う
    expect(getWebAuthnConfig()).toMatchObject({
      origin: "http://localhost:3000",
      rpID: "localhost",
    });
  });

  it("RP ID は origin と別に指定できる（親ドメインを使うため）", () => {
    vi.stubEnv("WEBAUTHN_ORIGIN", "https://app.example.com");
    vi.stubEnv("WEBAUTHN_RP_ID", "example.com");
    expect(getWebAuthnConfig()).toMatchObject({
      origin: "https://app.example.com",
      rpID: "example.com",
    });
  });

  it("本番で未設定ならエラーにする", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("WEBAUTHN_ORIGIN", "");
    vi.stubEnv("WEBAUTHN_RP_ID", "");
    expect(() => getWebAuthnConfig()).toThrow();
  });
});
