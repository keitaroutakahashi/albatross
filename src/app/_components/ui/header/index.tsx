import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/app/_components/shadcn/button";
import { SideNavigation } from "@/app/_components/ui/side-navigation";

export const Header = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-background/70 backdrop-blur-md">
      <div className="mx-auto max-w-3xl p-4 h-(--size-header-height) flex justify-between items-center">
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="Albatross"
            width={100}
            height={35}
          />
        </Link>
        <SideNavigation>
          <Button size="icon-sm" variant="default">
            <Menu />
          </Button>
        </SideNavigation>
      </div>
    </header>
  );
};
