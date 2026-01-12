import Link from "next/link";
import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  title: string;
  message?: string;
  hasHomeLink?: boolean;
}>;

export function ErrorPageTemplate({
  title,
  message,
  hasHomeLink = true,
  children,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-10">
      <span className="text-2xl">{title}</span>
      {message && <p>{message}</p>}
      {hasHomeLink && <Link href="/">Go to Home</Link>}
      {children}
    </div>
  );
}
