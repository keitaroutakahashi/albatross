import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

/** 項目が多いフォームを見出しで区切る */
export const FormSection = ({ title, children }: Props) => {
  return (
    <section className="flex flex-col gap-5">
      <h2 className="border-b pb-2 text-sm font-bold text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
};
