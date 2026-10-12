import { SectionSubtitle } from "@/app/(public)/events/[id]/_components/game/section-sub-title";

type Props = {
  title: string;
  children?: React.ReactNode;
};

export const SubSectionGroup = ({ title, children }: Props) => {
  return (
    <section className="flex flex-col">
      <SectionSubtitle text={title} />
      <div className="pt-1">{children}</div>
    </section>
  );
};
