import clsx from "clsx";

type Props = {
  text: string;
  colorClass: string;
  rbi: number;
};

export const AtBatResultBadge = ({ text, colorClass, rbi }: Props) => {
  return (
    <div
      className={clsx(
        colorClass,
        "p-1 @content:p-2 text-xs @content:text-sm rounded text-white font-bold",
      )}
    >
      {text}
      {rbi > 0 && <span className="text-xs @content:text-sm">({rbi})</span>}
    </div>
  );
};
