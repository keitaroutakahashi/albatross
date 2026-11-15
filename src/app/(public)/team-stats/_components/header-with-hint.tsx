import { HintTooltip } from "@/app/_components/ui/hint-tooltip";

type Props = {
  label: string;
  /** 指標の意味や算出方法の説明 */
  hint: string;
};

/** 表の見出しに、指標の説明を出すアイコンを添える（見出しの背景が暗いため、アイコンは明るくする） */
export const HeaderWithHint = ({ label, hint }: Props) => (
  <span className="inline-flex items-center gap-1">
    {label}
    <HintTooltip text={hint} className="text-gray-300 hover:text-white" />
  </span>
);
