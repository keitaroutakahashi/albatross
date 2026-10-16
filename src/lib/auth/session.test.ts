import { getSessionUser } from "@/lib/auth/session";
import { hashToken } from "@/lib/auth/token";
import prisma from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  default: {
    session: { findUnique: vi.fn(), deleteMany: vi.fn(), create: vi.fn() },
  },
}));

const db = vi.mocked(prisma.session);

const session = (overrides = {}, role = "admin") => ({
  id: "h",
  userId: 1,
  expiresAt: new Date(Date.now() + 60_000),
  createdAt: new Date(),
  user: { id: 1, email: "a@example.com", name: null, role },
  ...overrides,
});

describe("getSessionUser", () => {
  it("有効なセッションのユーザーを返す（ハッシュで検索する）", async () => {
    db.findUnique.mockResolvedValue(session() as never);
    expect(await getSessionUser("token")).toMatchObject({ id: 1 });
    expect(db.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: hashToken("token") } }),
    );
  });

  it("存在しないセッションは null", async () => {
    db.findUnique.mockResolvedValue(null);
    expect(await getSessionUser("token")).toBeNull();
  });

  it("期限切れは null にして破棄する", async () => {
    db.findUnique.mockResolvedValue(
      session({ expiresAt: new Date(Date.now() - 1) }) as never,
    );
    expect(await getSessionUser("token")).toBeNull();
    expect(db.deleteMany).toHaveBeenCalledWith({
      where: { id: hashToken("token") },
    });
  });

  it("一般ユーザーに変更されていたら null にして破棄する", async () => {
    db.findUnique.mockResolvedValue(session({}, "general") as never);
    expect(await getSessionUser("token")).toBeNull();
    expect(db.deleteMany).toHaveBeenCalled();
  });
});
