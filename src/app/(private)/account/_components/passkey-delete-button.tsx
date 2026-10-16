"use client";

import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { deletePasskey } from "@/app/_actions/auth";
import { Button } from "@/app/_components/shadcn/button";

type Props = { id: string; label: string };

export const PasskeyDeleteButton = ({ id, label }: Props) => {
  const [message, setMessage] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    // 誤タップで締め出されないよう、ブラウザ標準の確認を挟む
    if (!window.confirm(`「${label}」のパスキーを削除しますか？`)) return;
    startTransition(async () => {
      const result = await deletePasskey(id);
      setMessage(result.ok ? undefined : result.message);
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={handleClick}
      >
        <Trash2 />
        削除
      </Button>
      {message && (
        <p role="alert" className="text-xs text-destructive">
          {message}
        </p>
      )}
    </div>
  );
};
