import clsx from "clsx";

type Props = {
  name: string;
  size?: "2xl" | "xl" | "xs";
};

const sizeStyles = {
  "2xl": "size-16 md:size-24 text-2xl md:text-4xl",
  xl: "size-14 @content:size-24 text-xl @content:text-4xl",
  xs: "size-6 @content:size-8 text-xs @content:text-base",
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
