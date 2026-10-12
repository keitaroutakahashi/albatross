import { cn } from "@/lib/utils";

type Props = {
  children: string;
  tone?: "default" | "muted" | "danger";
};

export const Badge = ({ children, tone = "default" }: Props) => {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
        tone === "default" && "bg-primary/10 text-primary",
        tone === "muted" && "bg-muted text-muted-foreground",
        tone === "danger" && "bg-destructive/10 text-destructive",
      )}
    >
      {children}
    </span>
  );
};
