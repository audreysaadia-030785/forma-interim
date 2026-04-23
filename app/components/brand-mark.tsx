import Image from "next/image";

type BrandMarkProps = {
  variant?: "light" | "dark";
  /** Taille du logo: "sm" (40), "md" (56), "lg" (96), "xl" (160). */
  size?: "sm" | "md" | "lg" | "xl";
  /** Affiche le nom + slogan à côté du logo (par défaut: seulement en "sm"/"md"). */
  withText?: boolean;
};

const SIZE_MAP = {
  sm: { wrap: "h-10 w-24", px: 96 },
  md: { wrap: "h-14 w-32", px: 128 },
  lg: { wrap: "h-24 w-56", px: 224 },
  xl: { wrap: "h-40 w-72", px: 288 },
} as const;

/**
 * Logo officiel ASCV CONSEILS (/public/logo.png) sur fond clair.
 * Le logo est rectangulaire — on l'affiche tel quel, sans recadrage.
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
      <div
        className={`relative ${wrap} shrink-0 overflow-hidden rounded-xl ${
          isLight
            ? "bg-white/95 ring-1 ring-white/40 shadow-xl shadow-primary-900/30"
            : "bg-white ring-1 ring-neutral-200 shadow-sm"
        }`}
      >
        <Image
          src="/logo.png?v=ascv1"
          alt="Logo ASCV CONSEILS"
          fill
          sizes={`${px}px`}
          priority
          className="object-contain p-2"
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
            className={`text-[11px] italic tracking-wide ${
              isLight ? "text-primary-100" : "text-neutral-600"
            }`}
          >
            Recruter avec stratégie, grandir avec excellence
          </span>
        </div>
      )}
    </div>
  );
}
