import type { Metadata } from "next";
import { Root } from "@/app/(public)/games/_components/root";

export const metadata: Metadata = {
  title: "試合一覧",
};

type Props = {
  searchParams: Promise<{ season?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const { season } = await searchParams;

  return <Root season={season} />;
}
