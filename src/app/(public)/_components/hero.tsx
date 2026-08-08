import Image from "next/image";

/**
 * ローテーション表示する背景画像。
 * 全て重ねて配置し、animationDelay で 1 周 12s のアニメーション開始位置を
 * 4s ずつずらすことでクロスフェードさせる。
 */
const HERO_IMAGES = [
  { src: "/images/home/hero-01.jpg", animationDelay: "0s" },
  { src: "/images/home/hero-02.jpg", animationDelay: "-8s" },
  { src: "/images/home/hero-03.jpg", animationDelay: "-4s" },
];

export const Hero = () => {
  return (
    // 高さは親（Hero + NextGameBar のラッパー）から与えられる
    <div className="relative flex-1 min-h-0 bg-primary">
      {HERO_IMAGES.map(({ src, animationDelay }, index) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={index === 0}
          sizes="(max-width: 768px) 100vw, 768px"
          style={{ animationDelay }}
          className="object-cover animate-hero-rotate motion-reduce:animate-none"
        />
      ))}
      {/* テキストの可読性を確保するためのオーバーレイ */}
      <div className="absolute inset-0 bg-primary/70" />
      <div className="absolute inset-0 flex items-end px-6 pb-16 md:px-10 md:pb-24">
        <p className="text-5xl md:text-8xl font-bold leading-none tracking-tight text-white/80">
          WE ARE
          <br />
          ALBATROSS
        </p>
      </div>
    </div>
  );
};
