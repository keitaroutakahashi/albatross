import clsx from "clsx";

type Props = {
  score: number | null;
  bgColor?: string;
  isBold?: boolean;
};

export const ScoreBoardCell = ({
  score,
  bgColor = "bg-white",
  isBold = false,
}: Props) => {
  return (
    <td
      className={clsx(
        "py-2 text-center border-b border-gray-300 text-base @content:text-lg",
        bgColor,
        { "font-bold": isBold },
      )}
    >
      {score ?? "-"}
    </td>
  );
};
