"use client";

import { InfoIcon } from "lucide-react";
import {
  Popover as PopoverPrimitive,
  Tooltip as TooltipPrimitive,
} from "radix-ui";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  /** ヒントとして表示する説明文 */
  text: string;
  className?: string;
};

const CONTENT_CLASS_NAME =
  "z-50 max-w-64 rounded-md bg-gray-800 px-3 py-2 text-xs leading-relaxed text-white shadow-md";

const TRIGGER_CLASS_NAME =
  "inline-flex items-center justify-center text-gray-400 hover:text-gray-600";

/**
 * ヒントアイコン付きの汎用ツールチップ。
 * ホバー可能な PC ではホバーで、ホバーできないスマホ等ではタップで説明文を表示する。
 * `hover: hover` メディアクエリでデバイスの操作方法を判定し、実装（Tooltip / Popover）を切り替える。
 */
export const HintTooltip = ({ text, className }: Props) => {
  const [canHover, setCanHover] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanHover(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) =>
      setCanHover(event.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const triggerClassName = cn(TRIGGER_CLASS_NAME, className);

  // デバイス判定前（初回レンダー）はハイドレーション不一致を避けるため非活性表示にする
  if (canHover === null) {
    return (
      <span className={triggerClassName} aria-hidden="true">
        <InfoIcon className="size-4" />
      </span>
    );
  }

  if (canHover) {
    return (
      <TooltipPrimitive.Provider delayDuration={200}>
        <TooltipPrimitive.Root>
          <TooltipPrimitive.Trigger asChild>
            <button
              type="button"
              aria-label={text}
              className={triggerClassName}
            >
              <InfoIcon className="size-4" />
            </button>
          </TooltipPrimitive.Trigger>
          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
              side="top"
              sideOffset={6}
              className={CONTENT_CLASS_NAME}
            >
              {text}
              <TooltipPrimitive.Arrow className="fill-gray-800" />
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
      </TooltipPrimitive.Provider>
    );
  }

  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        <button type="button" aria-label={text} className={triggerClassName}>
          <InfoIcon className="size-4" />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          side="top"
          sideOffset={6}
          className={CONTENT_CLASS_NAME}
        >
          {text}
          <PopoverPrimitive.Arrow className="fill-gray-800" />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};
