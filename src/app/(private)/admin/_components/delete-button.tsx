"use client";

import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/app/_components/shadcn/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/_components/shadcn/drawer";
import { useNavigationProgressWhile } from "@/app/_components/ui/navigation-progress/use-navigation-progress-while";
import { Spinner } from "@/app/_components/ui/spinner";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";

type Props = {
  /** 確認文に表示する対象名 */
  targetName: string;
  /** 削除で一緒に消えるデータなど、確認文に追記する注意書き */
  warning?: string;
  action: () => Promise<ActionState>;
};

export const DeleteButton = ({ targetName, warning, action }: Props) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string>();
  const [isPending, startTransition] = useTransition();
  useNavigationProgressWhile(isPending);

  const handleDelete = () => {
    startTransition(async () => {
      // 成功時は Action 側の redirect で遷移するため、ここに戻るのは失敗時のみ
      const result = await action();
      setMessage(result.message);
    });
  };

  return (
    <Drawer
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setMessage(undefined);
      }}
    >
      <DrawerTrigger asChild>
        <Button type="button" variant="outline" size="lg" className="w-full">
          <Trash2 />
          削除する
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>削除しますか？</DrawerTitle>
          <DrawerDescription>
            「{targetName}」を削除します。この操作は取り消せません。
            {warning && <span className="mt-2 block">{warning}</span>}
          </DrawerDescription>
        </DrawerHeader>
        {message && (
          <p role="alert" className="px-4 text-center text-sm text-destructive">
            {message}
          </p>
        )}
        <DrawerFooter className="pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button
            type="button"
            variant="destructive"
            size="lg"
            disabled={isPending}
            onClick={handleDelete}
          >
            {isPending && <Spinner />}
            {isPending ? "削除中…" : "削除する"}
          </Button>
          <DrawerClose asChild>
            <Button type="button" variant="outline" size="lg">
              キャンセル
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
