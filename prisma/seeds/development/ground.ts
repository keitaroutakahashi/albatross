import type {
  Prisma,
  PrismaClient,
} from "../../../src/generated/prisma/client.js";

const groundData: Prisma.GroundCreateInput[] = [
  {
    name: "代々木公園野球場",
    address: "東京都渋谷区代々木神園町2-1",
    access: "JR原宿駅から徒歩10分",
    url: "https://www.tokyo-park.or.jp/park/format/index028.html",
  },
  {
    name: "多摩川緑地野球場",
    address: "東京都大田区田園調布1丁目",
    access: "東急東横線多摩川駅から徒歩5分",
    url: "https://www.tokyo-park.or.jp/park/format/index029.html",
  },
  {
    name: "荒川河川敷グラウンド",
    address: "東京都足立区千住大川町",
    access: "東武スカイツリーライン小菅駅から徒歩15分",
    url: "https://www.tokyo-park.or.jp/park/format/index030.html",
  },
  {
    name: "駒沢オリンピック公園野球場",
    address: "東京都世田谷区駒沢公園1-1",
    access: "東急田園都市線駒沢大学駅から徒歩15分",
    url: "https://www.tokyo-park.or.jp/park/format/index031.html",
  },
];

export async function seedGrounds(prisma: PrismaClient) {
  console.log("Seeding grounds...");
  for (const g of groundData) {
    await prisma.ground.create({ data: g });
  }
  console.log(`Created ${groundData.length} grounds`);
}
