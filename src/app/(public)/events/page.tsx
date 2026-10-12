import type { Metadata } from "next";
import { Root } from "@/app/(public)/events/_components/root";

export const metadata: Metadata = {
  title: "イベント一覧",
};

type Props = {
  searchParams: Promise<{ season?: string; type?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const { season, type } = await searchParams;

  return <Root season={season} type={type} />;
}
