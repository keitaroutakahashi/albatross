type Props = {
  text: string;
};

export const SectionHeader = ({ text }: Props) => {
  return (
    <h2 className="flex items-center gap-2 p-3 bg-primary text-white font-bold before:block before:h-4 before:w-3 before:bg-secondary before:shrink-0 before:[clip-path:polygon(60%_0,100%_0,40%_100%,0_100%)]">
      {text}
    </h2>
  );
};
