import clsx from "clsx";

type Props = {
  score: number;
  bgColor?: string;
};

export const ScoreBoardCell = ({ score, bgColor = "bg-white" }: Props) => {
  return (
    <td
      className={clsx(
        "py-2 text-center border-b border-gray-300 font-bold text-base @content:text-lg",
        bgColor,
      )}
    >
      {score}
    </td>
  );
};
