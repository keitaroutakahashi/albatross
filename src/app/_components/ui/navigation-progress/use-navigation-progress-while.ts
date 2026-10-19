"use client";

import { useEffect } from "react";
import {
  finishNavigationProgress,
  startNavigationProgress,
} from "@/app/_components/ui/navigation-progress/events";

/**
 * pending の間、進捗バーを出す。useTransition・useActionState・useFormStatus の待機状態を渡す。
 * 待機が終わったとき、またはコンポーネントが外れたとき（遷移で画面が切り替わったとき）に終了する。
 */
export const useNavigationProgressWhile = (pending: boolean) => {
  useEffect(() => {
    if (!pending) return;
    startNavigationProgress();
    return finishNavigationProgress;
  }, [pending]);
};
