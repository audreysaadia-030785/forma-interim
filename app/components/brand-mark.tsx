import Image from "next/image";

type BrandMarkProps = {
  variant?: "light" | "dark";
  /** Taille du logo: "sm" (40), "md" (56), "lg" (96), "xl" (160). */
  size?: "sm" | "md" | "lg" | "xl";
  /** Affiche le nom + slogan à côté du logo (par défaut: seulement en "sm"/"md"). */
  withText?: boolean;
};

const SIZE_MAP = {
  sm: { wrap: "h-10 w-10", px: 40 },
  md: { wrap: "h-14 w-14", px: 56 },
  lg: { wrap: "h-32 w-32", px: 128 },
  xl: { wrap: "h-56 w-56", px: 224 },
} as const;

/**
 * Logo officiel ASCV CONSEILS — version dorée sur fond transparent.
 * Pas de cadre / pas de fond, le logo est posé directement sur la page.
 */
export function BrandMark({
  variant = "dark",
  size = "md",
  withText,
}: BrandMarkProps) {
  const isLight = variant === "light";
  const { wrap, px } = SIZE_MAP[size];
  const showText = withText ?? size === "sm";

  return (
    <div className="flex items-center gap-3">
      <div className={`relative ${wrap} shrink-0`}>
        <Image
          src="/logo.png?v=ascv2"
          alt="Logo ASCV CONSEILS"
          fill
          sizes={`${px}px`}
          priority
          className="object-contain"
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="text-lg font-extrabold tracking-[0.08em]">
            <span className={isLight ? "text-white" : "text-primary-700"}>
              ASCV
            </span>{" "}
            <span className="text-accent-500">CONSEILS</span>
          </span>
          <span
            className={`text-[9px] tracking-wide font-serif italic ${
              isLight ? "text-primary-100" : "text-neutral-600"
            }`}
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            Recruter avec stratégie, grandir avec excellence
          </span>
        </div>
      )}
    </div>
  );
}
