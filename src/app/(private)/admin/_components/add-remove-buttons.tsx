import { Minus, Plus } from "lucide-react";
import { Button } from "@/app/_components/shadcn/button";

type Props = {
  count: number;
  /** これ以下には減らせない（「最後を削除」を押せなくする） */
  min?: number;
  max: number;
  noun: string;
  onChange: (next: number) => void;
};

/** 入力欄の行を、1 行ずつ増減するボタン */
export const AddRemoveButtons = ({
  count,
  min = 0,
  max,
  noun,
  onChange,
}: Props) => (
  <div className="flex gap-2">
    <Button
      type="button"
      variant="outline"
      className="h-11 flex-1"
      disabled={count >= max}
      onClick={() => onChange(count + 1)}
    >
      <Plus />
      {noun}を追加
    </Button>
    <Button
      type="button"
      variant="outline"
      className="h-11 flex-1"
      disabled={count <= min}
      onClick={() => onChange(count - 1)}
    >
      <Minus />
      最後を削除
    </Button>
  </div>
);
