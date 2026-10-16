import Image from "next/image";

type Props = {
  imagePath?: string | null;
};

const FALLBACK_IMAGE = "/images/grounds/example.jpg";

export const OverviewBackground = ({ imagePath }: Props) => {
  return (
    <Image
      src={imagePath || FALLBACK_IMAGE}
      alt=""
      fill
      className="object-cover object-center brightness-60"
      priority
    />
  );
};
