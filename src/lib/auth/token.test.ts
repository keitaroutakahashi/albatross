import { generateToken, hashToken } from "@/lib/auth/token";

describe("generateToken", () => {
  it("URL に載せられる文字だけで、毎回異なる値を返す", () => {
    const a = generateToken();
    const b = generateToken();
    expect(a).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(a).not.toBe(b);
  });
});

describe("hashToken", () => {
  it("同じ入力には同じハッシュ、異なる入力には異なるハッシュを返す", () => {
    expect(hashToken("abc")).toBe(hashToken("abc"));
    expect(hashToken("abc")).not.toBe(hashToken("abd"));
    expect(hashToken("abc")).toMatch(/^[0-9a-f]{64}$/);
  });

  it("元のトークンをそのまま返さない", () => {
    expect(hashToken("abc")).not.toContain("abc");
  });
});
