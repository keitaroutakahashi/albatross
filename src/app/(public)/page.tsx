import Image from "next/image";

export default function Page() {
  return (
    <div className="flex items-center justify-center">
      <Image
        src="/images/logo.png"
        alt="Albatross Logo"
        width={300}
        height={300}
      />
    </div>
  );
}
