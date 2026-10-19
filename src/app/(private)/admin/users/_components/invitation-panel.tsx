"use client";

import { Check, Copy, Link as LinkIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/app/_components/shadcn/button";
import { Input } from "@/app/_components/shadcn/input";
import { Spinner } from "@/app/_components/ui/spinner";

type IssueResult =
  | { ok: true; url: string; expiresAt: string }
  | { ok: false; message: string };

type Props = {
  /** 一般ユーザーはログインできないため、招待を発行しない */
  canSignIn: boolean;
  passkeyCount: number;
  issue: () => Promise<IssueResult>;
};

const dateTimeFormat = new Intl.DateTimeFormat("ja-JP", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Tokyo",
});

/** パスキー登録用の招待リンクの発行。リンクは発行直後にしか表示できない（DB にはハッシュしか残らない） */
export const InvitationPanel = ({ canSignIn, passkeyCount, issue }: Props) => {
  const [result, setResult] = useState<IssueResult>();
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!canSignIn) {
    return (
      <p className="mx-4 mt-4 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
        一般ユーザーは、ログインできません。
      </p>
    );
  }

  const registered = passkeyCount > 0;

  const handleIssue = () => {
    // 再発行は既存のログインを失効させるため、登録済みのユーザーには確認を挟む
    if (
      registered &&
      !window.confirm(
        "招待リンクを再発行すると、このユーザーの現在のログインはすべて無効になります。再発行しますか？",
      )
    ) {
      return;
    }
    startTransition(async () => {
      setCopied(false);
      setResult(await issue());
    });
  };

  const handleCopy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
  };

  return (
    <section className="mx-4 mt-4 flex flex-col gap-3 rounded-md border p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold">パスキー</p>
          <p className="text-xs text-muted-foreground">
            {registered ? `登録済み（${passkeyCount} 件）` : "未登録"}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={handleIssue}
        >
          {isPending ? <Spinner /> : <LinkIcon />}
          {registered ? "招待リンクを再発行" : "招待リンクを発行"}
        </Button>
      </div>

      {result && !result.ok && (
        <p role="alert" className="text-sm text-destructive">
          {result.message}
        </p>
      )}

      {result?.ok && (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Input
              readOnly
              value={result.url}
              aria-label="招待リンク"
              onFocus={(e) => e.currentTarget.select()}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="コピー"
              onClick={() => handleCopy(result.url)}
            >
              {copied ? <Check /> : <Copy />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {dateTimeFormat.format(new Date(result.expiresAt))}{" "}
            まで有効です。このリンクは今だけ表示されます。本人にだけ送ってください。
          </p>
        </div>
      )}
    </section>
  );
};
