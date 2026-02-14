import type {
  Prisma,
  PrismaClient,
} from "../../src/generated/prisma/client.js";

const memberData: Prisma.MemberCreateInput[] = [
  // スタメン想定（9名）
  {
    name: "田中太郎",
    number: 1,
    position: "pitcher",
    subPosition: "first",
    throwHand: "right",
    batHand: "right",
  },
  {
    name: "山田花子",
    number: 2,
    position: "catcher",
    throwHand: "right",
    batHand: "right",
  },
  {
    name: "佐藤一郎",
    number: 3,
    position: "first",
    subPosition: "left",
    throwHand: "left",
    batHand: "left",
  },
  {
    name: "鈴木雪",
    number: 4,
    position: "second",
    throwHand: "right",
    batHand: "both",
  },
  {
    name: "高橋健",
    number: 5,
    position: "third",
    subPosition: "shortstop",
    throwHand: "right",
    batHand: "right",
  },
  {
    name: "伊藤誠",
    number: 6,
    position: "shortstop",
    subPosition: "second",
    throwHand: "right",
    batHand: "left",
  },
  {
    name: "渡辺大輔",
    number: 7,
    position: "left",
    subPosition: "center",
    throwHand: "left",
    batHand: "left",
  },
  {
    name: "中村翔",
    number: 8,
    position: "center",
    subPosition: "right",
    throwHand: "right",
    batHand: "right",
  },
  {
    name: "小林勇気",
    number: 9,
    position: "right",
    subPosition: "left",
    throwHand: "right",
    batHand: "right",
  },
  // ベンチメンバー（3名）
  {
    name: "加藤隼人",
    number: 10,
    position: "pitcher",
    subPosition: "first",
    throwHand: "left",
    batHand: "left",
  },
  {
    name: "吉田拓也",
    number: 11,
    position: "catcher",
    subPosition: "third",
    throwHand: "right",
    batHand: "right",
  },
  {
    name: "松本涼介",
    number: 12,
    position: "center",
    subPosition: "left",
    throwHand: "right",
    batHand: "both",
  },
];

export async function seedMembers(prisma: PrismaClient) {
  console.log("Seeding members...");
  for (const m of memberData) {
    await prisma.member.create({ data: m });
  }
  console.log(`Created ${memberData.length} members`);
}
