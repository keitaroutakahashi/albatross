/** 開催日を過ぎても「開催予定」のままで、状態の更新が必要なことを示す赤丸 */
export const OverdueMark = () => (
  <span
    role="img"
    aria-label="更新が必要"
    className="block size-2 shrink-0 rounded-full bg-destructive"
  />
);
