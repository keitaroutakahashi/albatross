import { SectionHeader } from "@/app/(public)/events/[id]/_components/game/section-header";

type Props = {
  note: string | null;
};

export const EventNote = ({ note }: Props) => {
  if (!note) {
    return null;
  }

  return (
    <section>
      <SectionHeader text="備考" />
      <p className="whitespace-pre-line text-sm pt-3">{note}</p>
    </section>
  );
};
