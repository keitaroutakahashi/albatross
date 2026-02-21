import Image from "next/image";
import { InitialIcon } from "@/app/_components/ui/initial-icon";

type Props = {
  isFirstBatting: boolean;
  opponentName: string;
};

export const ScoreBoardTeamIcon = ({ isFirstBatting, opponentName }: Props) => {
  return (
    <td className="py-1 @content:py-2 border-b border-r border-gray-200 font-bold">
      <div className="flex items-center justify-center">
        {isFirstBatting ? (
          <Image
            src="/images/logo-initial.png"
            alt="Albatross Logo"
            width={128}
            height={128}
            className="w-5 @content:w-6 h-auto"
          />
        ) : (
          <InitialIcon name={opponentName} size="xs" />
        )}
      </div>
    </td>
  );
};
