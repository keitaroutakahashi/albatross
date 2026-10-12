import { notFound } from "next/navigation";
import { getPractice } from "@/app/_features/events/api/get-events";
import { Root } from "@/app/(public)/practices/[id]/_components/root";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const practiceId = Number.parseInt(id, 10);

  if (Number.isNaN(practiceId)) {
    notFound();
  }

  const practice = await getPractice(practiceId);

  if (!practice) {
    notFound();
  }

  return <Root practice={practice} />;
}
