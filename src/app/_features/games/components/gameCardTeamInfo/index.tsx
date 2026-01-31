import Image from "next/image";

type Props = {
  isHome: boolean;
  teamName?: string;
  pitcher?: string;
};

export const GameCardTeamInfo = ({ isHome, teamName, pitcher }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-2">
      {isHome ? (
        <Image
          src="/images/logo-initial.png"
          alt="Team A Logo"
          width={30}
          height={35}
        />
      ) : (
        <div className="size-9 bg-gray-300 rounded flex justify-center items-center font-bold">
          {teamName?.charAt(0)}
        </div>
      )}
      <span className="font-bold text-sm md:text-base">
        {isHome ? "Albatross" : teamName}
      </span>

      <div className="flex items-center">
        <span className="text-xs">{isHome ? (pitcher ?? "") : ""}</span>
      </div>
    </div>
  );
};
