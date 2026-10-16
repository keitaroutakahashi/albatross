import type {
  Prisma,
  PrismaClient,
} from "../../../src/generated/prisma/client.js";

const memberData: Prisma.MemberCreateInput[] = [
  {
    name: "高橋",
    uniformNumber: "10",
    position: "catcher",
    subPositions: ["shortstop"],
    throwHand: "right",
    batHand: "right",
  },
  {
    name: "菅原",
    uniformNumber: "51",
    position: "right",
    subPositions: ["left"],
    throwHand: "right",
    batHand: "right",
  },
  {
    name: "柳下",
    uniformNumber: "46",
    position: "center",
    subPositions: ["left"],
    throwHand: "right",
    batHand: "left",
  },
  {
    name: "楢橋",
    uniformNumber: "43",
    position: "second",
    throwHand: "right",
    batHand: "right",
  },
  {
    name: "海老澤",
    uniformNumber: "29",
    position: "first",
    subPositions: ["third"],
    throwHand: "right",
    batHand: "left",
  },
  {
    name: "小林(弘)",
    uniformNumber: "42",
    position: "shortstop",
    throwHand: "right",
    batHand: "right",
  },
  {
    name: "石川",
    uniformNumber: "19",
    position: "pitcher",
    subPositions: ["left"],
    throwHand: "right",
    batHand: "left",
  },
  {
    name: "渡辺(健)",
    uniformNumber: "1",
    position: "pitcher",
    subPositions: ["first"],
    throwHand: "left",
    batHand: "both",
  },
  {
    name: "今堀",
    uniformNumber: "14",
    position: "pitcher",
    subPositions: ["third", "left"],
    throwHand: "right",
    batHand: "right",
  },
  {
    name: "東",
    uniformNumber: "77",
    position: "left",
    subPositions: ["center", "right", "pitcher"],
    throwHand: "left",
    batHand: "left",
  },
  {
    name: "久野",
    uniformNumber: "25",
    position: "first",
    subPositions: ["third"],
    throwHand: "right",
    batHand: "right",
  },
  {
    name: "小森",
    uniformNumber: "5",
    position: "first",
    subPositions: ["catcher"],
    throwHand: "right",
    batHand: "right",
  },
  {
    name: "松橋",
    uniformNumber: "88",
    position: "right",
    throwHand: "left",
    batHand: "left",
  },
  {
    name: "佐藤(史)",
    uniformNumber: "23",
    position: "right",
    throwHand: "right",
    batHand: "left",
  },
  {
    name: "小林(岳)",
    uniformNumber: "33",
    position: "center",
    subPositions: ["third"],
    throwHand: "right",
    batHand: "right",
  },
  {
    name: "渡辺(涼)",
    uniformNumber: "15",
    position: "right",
    throwHand: "right",
    batHand: "right",
  },
  {
    name: "丹",
    uniformNumber: "44",
    position: "shortstop",
    throwHand: "right",
    batHand: "right",
  },
];

export async function seedMembers(prisma: PrismaClient) {
  console.log("Seeding members...");
  // user seed と同名の選手はアカウントに紐づける
  const users = await prisma.user.findMany({
    where: { name: { not: null } },
    select: { id: true, name: true },
  });
  const userIdByName = new Map(users.map((u) => [u.name, u.id]));

  // 本番でも実行するため、name が一致する既存の選手は触らず（管理画面での編集を残す）、
  // 未登録の選手だけを作成する
  let created = 0;
  for (const m of memberData) {
    const existing = await prisma.member.findFirst({ where: { name: m.name } });
    if (existing) continue;

    const userId = userIdByName.get(m.name);
    await prisma.member.create({
      data: { ...m, ...(userId && { user: { connect: { id: userId } } }) },
    });
    created++;
  }
  console.log(`Created ${created} members`);
}
