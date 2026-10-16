import { AuthError } from "@/lib/auth/errors";
import { findValidInvitation, issueInvitation } from "@/lib/auth/invitation";
import { hashToken } from "@/lib/auth/token";
import prisma from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  default: {
    user: { findUnique: vi.fn() },
    invitation: { findUnique: vi.fn(), deleteMany: vi.fn(), create: vi.fn() },
    session: { deleteMany: vi.fn() },
    $transaction: vi.fn(),
  },
}));

const invitationDb = vi.mocked(prisma.invitation);

const invitation = (overrides = {}, role = "admin") => ({
  id: 1,
  tokenHash: "h",
  userId: 10,
  expiresAt: new Date(Date.now() + 60_000),
  usedAt: null,
  createdAt: new Date(),
  user: { id: 10, email: "a@example.com", name: null, role },
  ...overrides,
});

describe("issueInvitation", () => {
  it("一般ユーザーには発行しない", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      role: "general",
    } as never);
    await expect(issueInvitation(1)).rejects.toThrow(AuthError);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it("存在しないユーザーには発行しない", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    await expect(issueInvitation(1)).rejects.toThrow(AuthError);
  });

  it("トークンはハッシュで保存し、未使用の招待と既存セッションを無効にする", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      role: "operator",
    } as never);
    const { token } = await issueInvitation(5);

    expect(invitationDb.deleteMany).toHaveBeenCalledWith({
      where: { userId: 5, usedAt: null },
    });
    expect(prisma.session.deleteMany).toHaveBeenCalledWith({
      where: { userId: 5 },
    });
    const saved = invitationDb.create.mock.calls[0][0].data;
    expect(saved.tokenHash).toBe(hashToken(token));
    expect(saved).not.toHaveProperty("token");
    expect(prisma.$transaction).toHaveBeenCalled();
  });
});

describe("findValidInvitation", () => {
  it("未使用・期限内なら返す", async () => {
    invitationDb.findUnique.mockResolvedValue(invitation() as never);
    expect(await findValidInvitation("t")).toMatchObject({ id: 1 });
    expect(invitationDb.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { tokenHash: hashToken("t") } }),
    );
  });

  it("存在しない招待は null", async () => {
    invitationDb.findUnique.mockResolvedValue(null);
    expect(await findValidInvitation("t")).toBeNull();
  });

  it("使用済みは null", async () => {
    invitationDb.findUnique.mockResolvedValue(
      invitation({ usedAt: new Date() }) as never,
    );
    expect(await findValidInvitation("t")).toBeNull();
  });

  it("期限切れは null", async () => {
    invitationDb.findUnique.mockResolvedValue(
      invitation({ expiresAt: new Date(Date.now() - 1) }) as never,
    );
    expect(await findValidInvitation("t")).toBeNull();
  });

  it("発行後に一般ユーザーへ変更されていたら null", async () => {
    invitationDb.findUnique.mockResolvedValue(
      invitation({}, "general") as never,
    );
    expect(await findValidInvitation("t")).toBeNull();
  });
});
