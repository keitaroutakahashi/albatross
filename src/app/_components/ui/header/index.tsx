import Image from "next/image";

export const Header = () => {
  return (
    <header className="p-4 h-(--size-header-height)">
      <Image src="/images/logo.png" alt="Albatross" width={120} height={42} />
    </header>
  );
};
