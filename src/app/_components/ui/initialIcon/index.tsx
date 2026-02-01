import clsx from "clsx";

type Props = {
  name: string;
  size?: "xl" | "xs";
};

const sizeStyles = {
  xl: "size-14 md:size-24 text-xl md:text-4xl",
  xs: "size-6 md:size-8 text-xs md:text-base",
} as const;

export const InitialIcon = ({ name, size = "xs" }: Props) => {
  return (
    <div
      className={clsx(
        sizeStyles[size],
        "bg-gray-500 rounded flex justify-center items-center font-bold text-white",
      )}
    >
      {name.charAt(0)}
    </div>
  );
};
