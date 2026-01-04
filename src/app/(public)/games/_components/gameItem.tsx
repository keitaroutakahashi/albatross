import Image from "next/image";

export const GameItem = () => {
  return (
    <li className="flex flex-col md:flex-row border border-gray-300 rounded overflow-hidden hover:border-black transition cursor-pointer">
      <div className="bg-gray-100 p-3 md:p-4 flex md:flex-col justify-between items-center">
        <div className="flex items-center gap-x-1">
          <p className="text-3xl font-bold">10.1</p>
          <div className="">
            <p className="text-xs text-gray-500 font-bold">WED</p>
            <p className="text-xs font-bold">2025</p>
          </div>
        </div>
        <p className="font-bold text-sm">サタデーリーグ</p>
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
          <p className="text-sm font-bold">東京ドーム</p>
          <div className="">
            <span className="text-4xl font-bold">5</span>
            <span className="text-4xl font-bold mx-2">-</span>
            <span className="text-4xl font-bold">3</span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-y-2">
          <div className="size-9 bg-gray-300 rounded flex justify-center items-center font-bold">
            A
          </div>
          <span className="font-bold">Albatross</span>
        </div>
      </div>
    </li>
  );
};
