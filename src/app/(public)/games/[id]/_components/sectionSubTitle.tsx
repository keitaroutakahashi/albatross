type Props = {
  text: string;
};

export const SectionSubtitle = ({ text }: Props) => {
  return (
    <h3 className="flex items-center gap-2 py-2 font-bold before:block before:w-1 before:h-5 before:bg-primary before:shrink-0 before:rounded-sm">
      {text}
    </h3>
  );
};
