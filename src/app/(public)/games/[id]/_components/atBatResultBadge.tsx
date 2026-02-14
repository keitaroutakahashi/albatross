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
        "p-1 md:p-2 text-xs md:text-sm rounded text-white font-bold",
      )}
    >
      {text}
      {rbi > 0 && <span className="text-xs md:text-sm">({rbi})</span>}
    </div>
  );
};
