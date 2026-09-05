import type { Metadata } from "next";
import { getMember } from "@/app/_features/members/api/get-members";
import { Root } from "@/app/(public)/members/[id]/_components/root";

type Props = {
  params: Promise<{ id: string }>;
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { id } = await params;
  const member = await getMember(Number(id));

  return {
    title: member.name,
  };
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <Root id={Number(id)} />;
}
