import type {
  Prisma,
  PrismaClient,
} from "../../src/generated/prisma/client.js";

const memberData: Prisma.MemberCreateInput[] = [
  // スタメン想定（9名）
  {
    name: "田中太郎",
    jerseyNumber: "1",
    position: "pitcher",
    subPositions: ["first"],
    throwHand: "right",
    batHand: "right",
  },
  {
    name: "山田花子",
    jerseyNumber: "2",
    position: "catcher",
    throwHand: "right",
    batHand: "right",
  },
  {
    name: "佐藤一郎",
    jerseyNumber: "3",
    position: "first",
    subPositions: ["left"],
    throwHand: "left",
    batHand: "left",
  },
  {
    name: "鈴木雪",
    jerseyNumber: "4",
    position: "second",
    throwHand: "right",
    batHand: "both",
  },
  {
    name: "高橋健",
    jerseyNumber: "5",
    position: "third",
    subPositions: ["shortstop", "first"],
    throwHand: "right",
    batHand: "right",
  },
  {
    name: "伊藤誠",
    jerseyNumber: "6",
    position: "shortstop",
    subPositions: ["second", "third"],
    throwHand: "right",
    batHand: "left",
  },
  {
    name: "渡辺大輔",
    jerseyNumber: "7",
    position: "left",
    subPositions: ["center", "right"],
    throwHand: "left",
    batHand: "left",
  },
  {
    name: "中村翔",
    jerseyNumber: "8",
    position: "center",
    subPositions: ["right"],
    throwHand: "right",
    batHand: "right",
  },
  {
    name: "小林勇気",
    jerseyNumber: "9",
    position: "right",
    subPositions: ["left"],
    throwHand: "right",
    batHand: "right",
  },
  // ベンチメンバー（3名）
  {
    name: "加藤隼人",
    jerseyNumber: "10",
    position: "pitcher",
    subPositions: ["first", "left"],
    throwHand: "left",
    batHand: "left",
  },
  {
    name: "吉田拓也",
    jerseyNumber: "11",
    position: "catcher",
    subPositions: ["third"],
    throwHand: "right",
    batHand: "right",
  },
  {
    name: "松本涼介",
    jerseyNumber: "12",
    position: "center",
    subPositions: ["left", "right"],
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
