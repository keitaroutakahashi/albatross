import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="text-white h-(--size-footer-height)">
      <div className="bg-primary py-4">
        <div className="flex justify-center">
          <Image
            src="/images/logo.png"
            alt="Albatross"
            width={80}
            height={80}
          />
        </div>
        <ul className="flex items-center justify-center gap-4 mt-3">
          <li>
            <Image
              src="/images/sns/youtube.png"
              alt="YouTube"
              width={40}
              height={40}
            />
          </li>
        </ul>
      </div>
      <div className="bg-secondary flex items-center justify-center py-2">
        <small className="text-xxs">© Albatross. All rights reserved.</small>
      </div>
    </footer>
  );
};
