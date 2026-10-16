import { canSignIn } from "@/lib/auth/policy";

describe("canSignIn", () => {
  it("管理者と運営はログインできる", () => {
    expect(canSignIn("admin")).toBe(true);
    expect(canSignIn("operator")).toBe(true);
  });

  it("一般ユーザーはログインできない", () => {
    expect(canSignIn("general")).toBe(false);
  });
});
