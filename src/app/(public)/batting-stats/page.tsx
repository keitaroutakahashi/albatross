import type { Metadata } from "next";
import { Root } from "@/app/(public)/batting-stats/_components/root";

export const metadata: Metadata = {
  title: "打者成績",
};

export default async function Page() {
  return <Root />;
}
