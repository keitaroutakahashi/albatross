import type {
  Prisma,
  PrismaClient,
} from "../../../src/generated/prisma/client.js";

const groundData: Prisma.GroundCreateInput[] = [
  {
    name: "福栄スポーツ広場野球場",
    address: "千葉県市川市福栄4丁目32-4",
    access:
      "東西線南行徳駅＞京成バス「ハイタウン塩浜行き」または、「新浦安駅行き」\n＞南行徳4丁目：下車＞徒歩3分",
    imagePath: "/images/grounds/fukuei.jpg",
    url: "https://www.city.ichikawa.lg.jp/page/7159.html",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1879.9964830483932!2d139.9099508174051!3d35.66714391882232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60187d8b8d6c4b09%3A0xdc30d5bdf36d324!2z56aP5qCE44K544Od44O844OE5bqD5aC06YeO55CD5aC077yh6Z2i!5e0!3m2!1sja!2sjp!4v1792164583057!5m2!1sja!2sjp",
  },
  {
    name: "国府台スタジアム",
    address: "千葉県市川市国府台1丁目6-4",
    access:
      "JR市川駅北口＞京成バス「松戸営業所行き」＞和洋女子大前：下車＞徒歩2分",
    imagePath: "/images/grounds/konodai.jpg",
    url: "https://www.city.ichikawa.lg.jp/page/4173.html",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3223.5576569905697!2d139.9052142938382!3d35.743601493764885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188427dae20efb%3A0x2de1073f3245238b!2z5Zu95bqc5Y-w44K544K_44K444Ki44Og!5e0!3m2!1sja!2sjp!4v1792165721720!5m2!1sja!2sjp",
  },
  {
    name: "光が丘公園 野球場",
    address: "東京都練馬区光が丘4丁目1-1",
    access: "都営地下鉄大江戸線「光が丘」(E38) 徒歩5分",
    imagePath: "/images/grounds/hikarigaoka.jpg",
    url: "https://www.tokyo-park.or.jp/park/hikarigaoka/facility/index.html",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7629.412762034763!2d139.62585042989244!3d35.76506475534198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018ec6ce827390f%3A0xb8c7c17179dbcdd2!2z5YWJ44GM5LiY5YWs5ZySIOmHjueQg-WgtA!5e0!3m2!1sja!2sjp!4v1792165960046!5m2!1sja!2sjp",
  },
  {
    name: "潮見野球場",
    address: "東京都江東区潮見1-1-1",
    access: "[JR京葉線]潮見駅から徒歩8分",
    url: "https://www.di-ksp.jp/facility/shiomi",
    imagePath: "/images/grounds/shiomi.jpg",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.8684987692586!2d139.81017169999998!3d35.65561139999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601889b248bdb51f%3A0x18b3cb7205520bc!2z5r2u6KaL6YeO55CD5aC0!5e0!3m2!1sja!2sjp!4v1792166230449!5m2!1sja!2sjp",
  },
];

export async function seedGrounds(prisma: PrismaClient) {
  console.log("Seeding grounds...");
  // 本番でも実行するため、name が一致する既存のグラウンドは更新し、重複させない
  for (const g of groundData) {
    const existing = await prisma.ground.findFirst({ where: { name: g.name } });
    if (existing) {
      await prisma.ground.update({ where: { id: existing.id }, data: g });
    } else {
      await prisma.ground.create({ data: g });
    }
  }
  console.log(`Seeded ${groundData.length} grounds`);
}
