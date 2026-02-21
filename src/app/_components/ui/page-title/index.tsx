type Props = {
  title: string;
  subtitle: string;
};

export const PageTitle = ({ title, subtitle }: Props) => {
  return (
    <div className="bg-primary border-t-4 border-secondary">
      <div className="py-8 text-center">
        <h1 className="text-4xl font-bold text-gray-500 tracking-wider">
          {title}
        </h1>
        <p className="text-white text-sm mt-2 font-bold">{subtitle}</p>
      </div>
    </div>
  );
};
