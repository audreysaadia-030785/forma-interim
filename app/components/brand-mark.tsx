import Image from "next/image";

type BrandMarkProps = {
  variant?: "light" | "dark";
  /** Taille du logo: "sm" (40), "md" (56), "lg" (96), "xl" (144). */
  size?: "sm" | "md" | "lg" | "xl";
  /** Affiche le nom + slogan à côté du logo (par défaut: seulement en "sm"/"md"). */
  withText?: boolean;
};

const SIZE_MAP = {
  sm: { box: "h-10 w-10", px: 40 },
  md: { box: "h-14 w-14", px: 56 },
  lg: { box: "h-28 w-28", px: 112 },
  xl: { box: "h-52 w-52", px: 208 },
} as const;

/**
 * Logo officiel Forma Interim (/public/logo.png).
 * Le logo contient déjà le nom et le slogan, on masque donc le texte
 * externe par défaut pour les tailles moyennes et grandes.
 */
export function BrandMark({
  variant = "dark",
  size = "md",
  withText,
}: BrandMarkProps) {
  const isLight = variant === "light";
  const { box, px } = SIZE_MAP[size];
  const showText = withText ?? size === "sm";

  return (
    <div className="flex items-center gap-3">
      <div
        className={`relative ${box} shrink-0 overflow-hidden rounded-full ${
          isLight
            ? "ring-2 ring-white/90 shadow-xl shadow-primary-900/30"
            : "ring-1 ring-neutral-200 shadow-lg shadow-primary-900/10"
        }`}
      >
        <Image
          src="/logo.png?v=2"
          alt="Logo Forma Interim"
          fill
          sizes={`${px}px`}
          priority
          className="object-cover"
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="text-lg font-extrabold tracking-tight">
            <span className={isLight ? "text-white" : "text-primary-600"}>
              FORMA
            </span>{" "}
            <span className="text-accent-500">INTERIM</span>
          </span>
          <span
            className={`text-[11px] italic tracking-wide ${
              isLight ? "text-primary-100" : "text-neutral-600"
            }`}
          >
            Votre talent, notre mission
          </span>
        </div>
      )}
    </div>
  );
}
