import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  title: string;
  /** 見出しの左に置く、内容を示すアイコン */
  icon?: LucideIcon;
  children: ReactNode;
};

/** 項目が多いフォームを、意味のまとまりごとのカードに区切る */
export const FormSection = ({ title, icon: Icon, children }: Props) => {
  return (
    <section className="flex flex-col gap-5 rounded-xl border bg-background p-4">
      <h2 className="flex items-center gap-2 text-base font-bold">
        {Icon && <Icon className="size-5 text-muted-foreground" />}
        {title}
      </h2>
      {children}
    </section>
  );
};
