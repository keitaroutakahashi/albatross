import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/** 処理中を示す小さなスピナー。文言（「保存中…」など）の横に添える装飾で、読み上げの対象にはしない */
export const Spinner = ({ className }: Props) => (
  <LoaderCircle
    aria-hidden
    className={cn("animate-spin motion-reduce:animate-none", className)}
  />
);
