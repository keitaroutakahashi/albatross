import { CircleHelp } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/shadcn/popover";

/** ラベルの右に置くヒント。スマホでは hover できないため、タップで開く */
export const HelpTip = ({
  label,
  children,
}: {
  /** ボタンの読み上げ名（何についてのヒントか） */
  label: string;
  children: React.ReactNode;
}) => (
  <Popover>
    <PopoverTrigger asChild>
      <button
        type="button"
        aria-label={`${label}のヒント`}
        className="-my-1 inline-flex size-6 items-center justify-center rounded-full text-muted-foreground hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <CircleHelp className="size-4" />
      </button>
    </PopoverTrigger>
    <PopoverContent className="flex flex-col gap-1 text-sm">
      {children}
    </PopoverContent>
  </Popover>
);
