import { cn } from "@/lib/utils";

type Props = {
  children: string;
  tone?: "default" | "muted" | "danger" | "info" | "success";
};

export const Badge = ({ children, tone = "default" }: Props) => {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
        tone === "default" && "bg-primary/10 text-primary",
        tone === "muted" && "bg-muted text-muted-foreground",
        tone === "danger" && "bg-destructive/10 text-destructive",
        tone === "info" && "bg-sky-100 text-sky-700",
        tone === "success" && "bg-emerald-100 text-emerald-700",
      )}
    >
      {children}
    </span>
  );
};
