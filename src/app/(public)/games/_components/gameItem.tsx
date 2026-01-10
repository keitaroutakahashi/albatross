import Image from "next/image";
import {
  formatAsMDWithColon,
  formatAsYYYY,
  formatToShortDayNameEn,
} from "@/app/_utils/date/date";

export const GameItem = ({ game }) => {
  return (
    <li className="flex flex-col md:flex-row border border-gray-300 rounded overflow-hidden hover:border-black transition cursor-pointer">
      <div className="bg-gray-100 p-3 md:p-4 flex md:flex-col md:w-64 justify-between items-center">
        <div className="flex items-center gap-x-1">
          <p className="text-3xl font-bold">
            {formatAsMDWithColon(game.gameDate)}
          </p>
          <div className="">
            <p className="text-xs text-gray-500 font-bold">
              {formatToShortDayNameEn(game.gameDate)}
            </p>
            <p className="text-xs font-bold">{formatAsYYYY(game.gameDate)}</p>
          </div>
        </div>
        <p className="font-bold text-sm">{game.leagueName}</p>
      </div>

      <div className="grid grid-cols-3 p-3 md:px-10 md:flex-1">
        <div className="flex flex-col items-center justify-center gap-y-2">
          <Image
            src="/images/logo-initial.png"
            alt="Team A Logo"
            width={30}
            height={35}
          />
          <span className="font-bold">Albatross</span>
          <div className="flex items-center space-x-2">
            <span className="bg-primary text-white text-xs rounded size-5 font-bold flex items-center justify-center">
              勝
            </span>
            <span className="text-xs">山田 太郎</span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm font-bold">{game.venue}</p>
          <div className="">
            <span className="text-4xl font-bold">{game.teamScore}</span>
            <span className="text-4xl font-bold mx-2">-</span>
            <span className="text-4xl font-bold">{game.opposingTeamScore}</span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-y-2">
          <div className="size-9 bg-gray-300 rounded flex justify-center items-center font-bold">
            A
          </div>
          <span className="font-bold">{game.opposingTeam}</span>
        </div>
      </div>
    </li>
  );
};
