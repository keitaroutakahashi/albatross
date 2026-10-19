"use client";

import type { ReactNode } from "react";
import { useActionState } from "react";
import { Button } from "@/app/_components/shadcn/button";
import { useNavigationProgressWhile } from "@/app/_components/ui/navigation-progress/use-navigation-progress-while";
import { Spinner } from "@/app/_components/ui/spinner";
import { DeleteButton } from "@/app/(private)/admin/_components/delete-button";
import {
  type ActionState,
  initialActionState,
} from "@/app/(private)/admin/_utils/action-state";

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  /** 編集画面のみ指定する */
  deleteTarget?: {
    name: string;
    warning?: string;
    action: () => Promise<ActionState>;
  };
  children: (state: ActionState) => ReactNode;
  /** 送信ボタンの文言。新規登録など、「保存」ではない操作で指定する */
  submitLabel?: { idle: string; pending: string };
};

/** 作成・編集フォーム共通の枠。入力欄は children で受け取る */
export const FormShell = ({
  action,
  deleteTarget,
  children,
  submitLabel = { idle: "保存する", pending: "保存中…" },
}: Props) => {
  const [state, formAction, isPending] = useActionState(
    action,
    initialActionState,
  );
  // 保存後のリダイレクトで画面が切り替わるまでの待ち時間も、進捗バーで示す
  useNavigationProgressWhile(isPending);

  return (
    <div className="flex flex-col gap-8 p-4">
      <form id="admin-form" action={formAction} className="flex flex-col gap-5">
        {state.message && (
          <p
            role="alert"
            className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {state.message}
          </p>
        )}
        {children(state)}
      </form>

      {deleteTarget && (
        <DeleteButton
          targetName={deleteTarget.name}
          warning={deleteTarget.warning}
          action={deleteTarget.action}
        />
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background">
        <div className="mx-auto max-w-3xl p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <Button
            type="submit"
            form="admin-form"
            size="lg"
            disabled={isPending}
            className="h-11 w-full"
          >
            {isPending && <Spinner />}
            {isPending ? submitLabel.pending : submitLabel.idle}
          </Button>
        </div>
      </div>
    </div>
  );
};
