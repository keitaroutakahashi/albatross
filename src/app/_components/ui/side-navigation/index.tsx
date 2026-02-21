import Link from "next/link";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/_components/shadcn/drawer";

type Props = {
  children: React.ReactNode;
};

export function SideNavigation({ children }: Props) {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="data-[vaul-drawer-direction=bottom]:max-h-[50vh] data-[vaul-drawer-direction=top]:max-h-[50vh]">
        <div className="no-scrollbar overflow-y-auto p-4 flex flex-col gap-5">
          <div>
            <DrawerTitle className="text-sm">試合</DrawerTitle>
            <ul className="mt-1">
              <li>
                <DrawerClose asChild>
                  <Link href="/games" className="text-sm underline">
                    試合一覧
                  </Link>
                </DrawerClose>
              </li>
            </ul>
          </div>
          <div>
            <DrawerTitle className="text-sm">メンバー</DrawerTitle>
            <ul className="mt-1">
              <li>
                <DrawerClose asChild>
                  <Link href="/members" className="text-sm underline">
                    メンバー一覧
                  </Link>
                </DrawerClose>
              </li>
            </ul>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
