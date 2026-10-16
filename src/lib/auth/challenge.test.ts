import { consumeChallenge } from "@/lib/auth/challenge";
import prisma from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  default: {
    webAuthnChallenge: {
      findUnique: vi.fn(),
      deleteMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

const db = vi.mocked(prisma.webAuthnChallenge);

const record = (overrides = {}) => ({
  id: "c1",
  challenge: "abc",
  purpose: "authentication" as const,
  userId: null,
  expiresAt: new Date(Date.now() + 60_000),
  createdAt: new Date(),
  ...overrides,
});

describe("consumeChallenge", () => {
  it("存在しないチャレンジは null", async () => {
    db.findUnique.mockResolvedValue(null);
    expect(await consumeChallenge("c1", "authentication")).toBeNull();
    expect(db.deleteMany).not.toHaveBeenCalled();
  });

  it("有効なチャレンジを返し、削除する", async () => {
    db.findUnique.mockResolvedValue(record());
    db.deleteMany.mockResolvedValue({ count: 1 });
    expect(await consumeChallenge("c1", "authentication")).toMatchObject({
      challenge: "abc",
    });
    expect(db.deleteMany).toHaveBeenCalledWith({ where: { id: "c1" } });
  });

  it("並行して先に消費されていたら null（二重利用の防止）", async () => {
    db.findUnique.mockResolvedValue(record());
    db.deleteMany.mockResolvedValue({ count: 0 });
    expect(await consumeChallenge("c1", "authentication")).toBeNull();
  });

  it("用途が違うチャレンジは null", async () => {
    db.findUnique.mockResolvedValue(record({ purpose: "registration" }));
    db.deleteMany.mockResolvedValue({ count: 1 });
    expect(await consumeChallenge("c1", "authentication")).toBeNull();
  });

  it("期限切れは null", async () => {
    db.findUnique.mockResolvedValue(
      record({ expiresAt: new Date(Date.now() - 1) }),
    );
    db.deleteMany.mockResolvedValue({ count: 1 });
    expect(await consumeChallenge("c1", "authentication")).toBeNull();
  });
});
