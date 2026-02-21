import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/app/_components/shadcn/button";
import { SideNavigation } from "@/app/_components/ui/side-navigation";

export const Header = () => {
  return (
    <header className="p-4 h-(--size-header-height) flex justify-between items-center">
      <Link href="/">
        <Image src="/images/logo.png" alt="Albatross" width={100} height={35} />
      </Link>
      <SideNavigation>
        <Button size="sm" variant="default">
          <Menu />
        </Button>
      </SideNavigation>
    </header>
  );
};
