import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { type Prisma, PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const userData: Prisma.UserCreateInput[] = [
  { email: "taro@example.com", name: "田中太郎" },
  { email: "hanako@example.com", name: "山田花子" },
  { email: "ichiro@example.com", name: "佐藤一郎" },
  { email: "yuki@example.com", name: "鈴木雪" },
  { email: "ken@example.com", name: "高橋健" },
];

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u });
  }
}

main();
