import { SectionHeader } from "@/app/(public)/games/[id]/_components/section-header";

type Props = {
  title: string;
  children?: React.ReactNode;
};

export const SectionGroup = ({ title, children }: Props) => {
  return (
    <section className="flex flex-col">
      <SectionHeader text={title} />
      <div className="flex flex-col pt-2 @content:py-4 gap-y-4 @content:gap-y-6">
        {children}
      </div>
    </section>
  );
};
