import * as React from "react";
import type { SceneName } from "./scenes";

/**
 * "Product shot" silhouettes for the CSS/SVG video art — one per kind of business.
 * Drawn on a 200×200 canvas, sitting on y≈178. Theme-independent tokens only.
 */
export type PropName =
  | "house" | "building" | "plate" | "cup" | "bottle" | "dropper" | "scissors" | "dumbbell" | "tooth" | "car"
  | "cabin" | "bag" | "sofa" | "camera" | "vinyl" | "books" | "paw" | "doc" | "toolbox" | "heart" | "balloons";

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}b`} x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0" stopColor="var(--color-paper)" />
        <stop offset="1" stopColor="var(--color-scene-sand)" />
      </linearGradient>
      <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="var(--color-primary)" />
        <stop offset="0.55" stopColor="var(--color-coral)" />
        <stop offset="1" stopColor="var(--color-scene-wine)" />
      </linearGradient>
      <linearGradient id={`${id}d`} x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0" stopColor="var(--color-scene-navy)" />
        <stop offset="1" stopColor="var(--color-ink)" />
      </linearGradient>
      <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="var(--color-scene-sky)" />
        <stop offset="1" stopColor="var(--color-scene-navy)" />
      </linearGradient>
      <radialGradient id={`${id}l`} cx="0.5" cy="0.4" r="0.7">
        <stop offset="0" stopColor="var(--color-lemon)" />
        <stop offset="1" stopColor="var(--color-primary)" />
      </radialGradient>
      <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="var(--color-paper)" stopOpacity="0.55" />
        <stop offset="1" stopColor="var(--color-paper)" stopOpacity="0" />
      </linearGradient>
    </defs>
  );
}

type Draw = (u: (k: string) => string) => React.ReactNode;

const steam = (x: number, y: number) => (
  <path
    d={`M${x} ${y} q-7 -10 0 -20 q7 -10 0 -20`}
    fill="none"
    stroke="var(--color-paper)"
    strokeOpacity=".55"
    strokeWidth="4"
    strokeLinecap="round"
  />
);

const DRAW: Record<PropName, Draw> = {
  house: (u) => (
    <>
      <rect x="132" y="56" width="16" height="34" rx="3" fill={u("d")} />
      <path d="M34 108 L100 54 L166 108 V176 H34 Z" fill={u("b")} />
      <path d="M22 110 L100 46 L178 110" fill="none" stroke={u("a")} strokeWidth="12" strokeLinejoin="round" strokeLinecap="round" />
      <rect x="50" y="118" width="34" height="30" rx="5" fill={u("l")} />
      <rect x="116" y="118" width="34" height="30" rx="5" fill={u("l")} />
      <path d="M67 118 V148 M50 133 H84 M133 118 V148 M116 133 H150" stroke="var(--color-scene-cocoa)" strokeOpacity=".35" strokeWidth="2.5" />
      <rect x="88" y="132" width="24" height="44" rx="4" fill={u("d")} />
      <circle cx="106" cy="155" r="2.2" fill="var(--color-primary)" />
      <rect x="34" y="108" width="12" height="68" fill={u("s")} />
    </>
  ),
  building: (u) => (
    <>
      <rect x="24" y="98" width="42" height="80" rx="4" fill={u("b")} opacity=".9" />
      <rect x="134" y="80" width="44" height="98" rx="4" fill={u("b")} opacity=".9" />
      <rect x="62" y="26" width="76" height="152" rx="6" fill={u("g")} />
      {Array.from({ length: 8 }).map((_, r) =>
        [0, 1, 2, 3].map((c) => (
          <rect
            key={`${r}-${c}`}
            x={70 + c * 16.5}
            y={36 + r * 17}
            width="10"
            height="10"
            rx="2"
            fill={(r * 4 + c) % 3 === 0 ? u("l") : "var(--color-paper)"}
            opacity={(r * 4 + c) % 3 === 0 ? 1 : 0.22}
          />
        )),
      )}
      <rect x="62" y="26" width="14" height="152" fill={u("s")} />
      <rect x="92" y="164" width="16" height="14" rx="2" fill="var(--color-ink)" opacity=".7" />
    </>
  ),
  plate: (u) => (
    <>
      <ellipse cx="100" cy="158" rx="84" ry="18" fill={u("b")} opacity=".9" />
      {steam(80, 84)}
      {steam(104, 76)}
      {steam(126, 86)}
      <circle cx="80" cy="118" r="20" fill={u("a")} />
      <circle cx="106" cy="108" r="24" fill="var(--color-primary)" />
      <circle cx="130" cy="120" r="17" fill="var(--color-scene-mint)" />
      <circle cx="98" cy="96" r="5" fill="var(--color-paper)" opacity=".7" />
      <path d="M36 122 Q100 204 164 122 Z" fill={u("b")} />
      <path d="M36 122 Q100 134 164 122" fill="none" stroke="var(--color-scene-cocoa)" strokeOpacity=".25" strokeWidth="3" />
      <path d="M50 132 Q70 160 96 166" fill="none" stroke="var(--color-paper)" strokeWidth="5" strokeLinecap="round" opacity=".8" />
    </>
  ),
  cup: (u) => (
    <>
      <ellipse cx="100" cy="166" rx="74" ry="13" fill={u("b")} />
      {steam(86, 82)}
      {steam(112, 76)}
      <path d="M144 112 q28 0 26 22 q-2 20 -30 18" fill="none" stroke={u("a")} strokeWidth="10" strokeLinecap="round" />
      <path d="M54 100 H146 L138 152 Q134 166 120 166 H80 Q66 166 62 152 Z" fill={u("a")} />
      <ellipse cx="100" cy="100" rx="46" ry="9" fill="var(--color-scene-cocoa)" />
      <path d="M92 98 q8 -8 8 2 q0 -10 8 -2 q-8 8 -8 6 q0 2 -8 -6" fill="var(--color-scene-sand)" />
      <path d="M64 110 Q66 140 78 156" stroke="var(--color-paper)" strokeOpacity=".55" strokeWidth="5" strokeLinecap="round" fill="none" />
    </>
  ),
  bottle: (u) => (
    <>
      <rect x="84" y="30" width="32" height="64" rx="7" fill={u("d")} />
      <rect x="88" y="34" width="6" height="56" rx="3" fill="var(--color-paper)" opacity=".25" />
      <rect x="76" y="90" width="48" height="12" rx="3" fill={u("b")} />
      <rect x="52" y="100" width="96" height="78" rx="24" fill={u("a")} />
      <rect x="62" y="110" width="12" height="56" rx="6" fill="var(--color-paper)" opacity=".45" />
      <circle cx="160" cy="160" r="9" fill={u("a")} />
      <circle cx="40" cy="150" r="6" fill="var(--color-scene-blush)" />
    </>
  ),
  dropper: (u) => (
    <>
      <ellipse cx="100" cy="36" rx="16" ry="18" fill={u("d")} />
      <rect x="84" y="46" width="32" height="36" rx="4" fill={u("b")} />
      <rect x="66" y="80" width="68" height="98" rx="16" fill="var(--color-paper)" opacity=".35" />
      <rect x="66" y="118" width="68" height="60" rx="16" fill={u("a")} opacity=".95" />
      <rect x="74" y="88" width="10" height="80" rx="5" fill="var(--color-paper)" opacity=".6" />
      <rect x="80" y="128" width="40" height="22" rx="4" fill="var(--color-paper)" opacity=".85" />
      <path d="M156 70 l5 12 l12 5 l-12 5 l-5 12 l-5 -12 l-12 -5 l12 -5 Z" fill="var(--color-lemon)" />
      <path d="M40 110 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 Z" fill="var(--color-paper)" />
    </>
  ),
  scissors: (u) => (
    <>
      <path d="M86 128 L146 34" stroke={u("b")} strokeWidth="15" strokeLinecap="round" />
      <path d="M114 128 L54 34" stroke={u("b")} strokeWidth="15" strokeLinecap="round" />
      <path d="M90 120 L140 40" stroke="var(--color-paper)" strokeWidth="3" strokeLinecap="round" opacity=".8" />
      <circle cx="100" cy="106" r="7" fill={u("d")} />
      <circle cx="72" cy="150" r="22" fill="none" stroke={u("a")} strokeWidth="11" />
      <circle cx="128" cy="150" r="22" fill="none" stroke={u("a")} strokeWidth="11" />
      <rect x="22" y="168" width="156" height="10" rx="5" fill={u("d")} opacity=".6" />
    </>
  ),
  dumbbell: (u) => (
    <>
      <rect x="46" y="112" width="108" height="14" rx="7" fill={u("b")} />
      <rect x="18" y="94" width="16" height="50" rx="6" fill={u("d")} />
      <rect x="32" y="80" width="22" height="78" rx="7" fill={u("a")} />
      <rect x="166" y="94" width="16" height="50" rx="6" fill={u("d")} />
      <rect x="146" y="80" width="22" height="78" rx="7" fill={u("a")} />
      <rect x="36" y="86" width="5" height="64" rx="2.5" fill="var(--color-paper)" opacity=".45" />
      <rect x="150" y="86" width="5" height="64" rx="2.5" fill="var(--color-paper)" opacity=".45" />
      <rect x="84" y="110" width="32" height="18" rx="4" fill={u("d")} opacity=".5" />
    </>
  ),
  tooth: (u) => (
    <>
      <path
        d="M100 62 C80 42 44 46 42 84 C40 114 56 130 62 160 C66 180 82 182 86 160 L91 134 Q100 122 109 134 L114 160 C118 182 134 180 138 160 C144 130 160 114 158 84 C156 46 120 42 100 62 Z"
        fill={u("b")}
      />
      <path d="M58 76 C62 62 76 58 86 64" fill="none" stroke="var(--color-paper)" strokeWidth="6" strokeLinecap="round" />
      <path d="M152 40 l6 14 l14 6 l-14 6 l-6 14 l-6 -14 l-14 -6 l14 -6 Z" fill="var(--color-lemon)" />
      <path d="M40 40 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 Z" fill="var(--color-paper)" />
    </>
  ),
  car: (u) => (
    <>
      <path
        d="M20 146 Q22 126 46 122 L72 98 Q80 90 94 90 H128 Q142 90 152 100 L172 120 Q186 124 186 140 V150 Q186 158 178 158 H28 Q20 158 20 146 Z"
        fill={u("a")}
      />
      <path d="M76 104 Q84 96 96 96 H110 V120 H60 Z" fill={u("g")} />
      <path d="M118 96 H128 Q138 96 146 104 L160 120 H118 Z" fill={u("g")} />
      <path d="M36 132 H176" stroke="var(--color-paper)" strokeOpacity=".4" strokeWidth="3" />
      <circle cx="58" cy="158" r="19" fill={u("d")} />
      <circle cx="58" cy="158" r="8" fill={u("b")} />
      <circle cx="150" cy="158" r="19" fill={u("d")} />
      <circle cx="150" cy="158" r="8" fill={u("b")} />
      <rect x="174" y="128" width="10" height="7" rx="3" fill="var(--color-lemon)" />
    </>
  ),
  cabin: (u) => (
    <>
      <circle cx="158" cy="44" r="13" fill="var(--color-paper)" opacity=".9" />
      <path d="M14 178 L34 120 L54 178 Z" fill={u("d")} opacity=".85" />
      <path d="M150 178 L170 112 L190 178 Z" fill={u("d")} opacity=".85" />
      <path d="M40 178 L100 58 L160 178 Z" fill="var(--color-scene-cocoa)" />
      <path d="M34 182 L100 50 L166 182" fill="none" stroke={u("a")} strokeWidth="9" strokeLinejoin="round" />
      <path d="M64 178 L100 104 L136 178 Z" fill={u("l")} />
      <path d="M100 104 V178 M80 146 H120" stroke="var(--color-scene-cocoa)" strokeOpacity=".5" strokeWidth="3" />
    </>
  ),
  bag: (u) => (
    <>
      <path d="M112 74 H176 L182 170 H106 Z" fill={u("b")} opacity=".85" />
      <path d="M128 76 V64 Q128 48 144 48 Q160 48 160 64 V76" fill="none" stroke={u("d")} strokeWidth="6" />
      <path d="M30 86 H134 L142 178 H22 Z" fill={u("a")} />
      <path d="M134 86 L142 178 H124 L118 86 Z" fill="var(--color-ink)" opacity=".18" />
      <path d="M58 88 V70 Q58 46 82 46 Q106 46 106 70 V88" fill="none" stroke={u("d")} strokeWidth="8" strokeLinecap="round" />
      <rect x="54" y="118" width="56" height="28" rx="14" fill="var(--color-paper)" opacity=".92" />
      <path d="M70 132 h24" stroke="var(--color-coral)" strokeWidth="5" strokeLinecap="round" />
    </>
  ),
  sofa: (u) => (
    <>
      <rect x="38" y="84" width="124" height="48" rx="16" fill="var(--color-coral)" />
      <rect x="24" y="118" width="152" height="40" rx="14" fill={u("a")} />
      <rect x="14" y="104" width="30" height="56" rx="13" fill={u("a")} />
      <rect x="156" y="104" width="30" height="56" rx="13" fill={u("a")} />
      <rect x="54" y="96" width="34" height="28" rx="10" fill={u("b")} transform="rotate(-8 71 110)" />
      <rect x="112" y="96" width="34" height="28" rx="10" fill={u("b")} transform="rotate(8 129 110)" />
      <rect x="30" y="158" width="8" height="18" rx="3" fill={u("d")} />
      <rect x="162" y="158" width="8" height="18" rx="3" fill={u("d")} />
      <rect x="28" y="122" width="144" height="5" rx="2.5" fill="var(--color-paper)" opacity=".35" />
    </>
  ),
  camera: (u) => (
    <>
      <rect x="58" y="54" width="44" height="24" rx="6" fill={u("d")} />
      <rect x="26" y="70" width="148" height="100" rx="18" fill={u("d")} />
      <rect x="26" y="96" width="148" height="12" fill={u("a")} />
      <circle cx="100" cy="122" r="40" fill={u("b")} />
      <circle cx="100" cy="122" r="30" fill="var(--color-ink)" />
      <circle cx="100" cy="122" r="19" fill={u("g")} />
      <circle cx="92" cy="114" r="6" fill="var(--color-paper)" opacity=".8" />
      <rect x="142" y="80" width="18" height="10" rx="3" fill="var(--color-lemon)" />
    </>
  ),
  vinyl: (u) => (
    <>
      <circle cx="100" cy="112" r="70" fill={u("d")} />
      {[60, 50, 40].map((r) => (
        <circle key={r} cx="100" cy="112" r={r} fill="none" stroke="var(--color-paper)" strokeOpacity=".12" strokeWidth="2" />
      ))}
      <path d="M52 72 A62 62 0 0 1 100 50" fill="none" stroke="var(--color-paper)" strokeOpacity=".35" strokeWidth="5" strokeLinecap="round" />
      <circle cx="100" cy="112" r="24" fill={u("a")} />
      <circle cx="100" cy="112" r="4" fill={u("b")} />
      <path d="M160 40 v34 a9 7 0 1 1 -6 -6 v-22 l18 -6" fill="none" stroke="var(--color-lemon)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  books: (u) => (
    <>
      <rect x="40" y="148" width="124" height="28" rx="5" fill={u("a")} />
      <rect x="50" y="122" width="110" height="26" rx="5" fill={u("b")} />
      <rect x="34" y="96" width="118" height="26" rx="5" fill="var(--color-scene-teal)" />
      <path d="M150 128 H158 M150 136 H158 M44 156 H50 M44 164 H50" stroke="var(--color-scene-cocoa)" strokeOpacity=".4" strokeWidth="2" />
      <path d="M100 42 L162 66 L100 90 L38 66 Z" fill={u("d")} />
      <path d="M68 78 V96 Q100 110 132 96 V78" fill={u("d")} />
      <path d="M150 70 V96" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" />
      <circle cx="150" cy="99" r="5" fill="var(--color-primary)" />
    </>
  ),
  paw: (u) => (
    <>
      <ellipse cx="100" cy="134" rx="40" ry="34" fill={u("a")} />
      <ellipse cx="54" cy="96" rx="15" ry="20" fill={u("b")} transform="rotate(-18 54 96)" />
      <ellipse cx="82" cy="70" rx="15" ry="20" fill={u("b")} />
      <ellipse cx="118" cy="70" rx="15" ry="20" fill={u("b")} />
      <ellipse cx="146" cy="96" rx="15" ry="20" fill={u("b")} transform="rotate(18 146 96)" />
      <ellipse cx="88" cy="122" rx="10" ry="6" fill="var(--color-paper)" opacity=".4" />
    </>
  ),
  doc: (u) => (
    <>
      <rect x="62" y="34" width="96" height="128" rx="10" fill={u("b")} opacity=".55" transform="rotate(6 110 98)" />
      <rect x="46" y="38" width="100" height="134" rx="10" fill={u("b")} />
      <rect x="60" y="56" width="52" height="8" rx="4" fill={u("d")} />
      <rect x="60" y="72" width="72" height="6" rx="3" fill={u("d")} opacity=".25" />
      <rect x="60" y="84" width="64" height="6" rx="3" fill={u("d")} opacity=".25" />
      {[[62, 138, 30], [80, 126, 42], [98, 112, 56], [116, 132, 36]].map(([x, y, h]) => (
        <rect key={x} x={x} y={y} width="12" height={h} rx="3" fill={u("a")} />
      ))}
      <circle cx="150" cy="150" r="24" fill={u("d")} />
      <path d="M139 150 l8 8 l15 -16" fill="none" stroke="var(--color-scene-mint)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  toolbox: (u) => (
    <>
      <rect x="112" y="34" width="12" height="78" rx="5" fill="var(--color-scene-sand)" transform="rotate(24 118 74)" />
      <rect x="114" y="28" width="44" height="18" rx="5" fill={u("d")} transform="rotate(24 136 37)" />
      <path d="M74 98 V84 Q74 76 82 76 H118 Q126 76 126 84 V98" fill="none" stroke={u("d")} strokeWidth="8" />
      <rect x="24" y="96" width="152" height="24" rx="8" fill="var(--color-coral)" />
      <rect x="30" y="114" width="140" height="62" rx="10" fill={u("a")} />
      <rect x="86" y="108" width="28" height="18" rx="4" fill={u("b")} />
      <rect x="36" y="124" width="128" height="4" rx="2" fill="var(--color-paper)" opacity=".35" />
    </>
  ),
  heart: (u) => (
    <>
      <circle cx="100" cy="110" r="78" fill="var(--color-paper)" opacity=".08" />
      <circle cx="100" cy="110" r="60" fill="var(--color-paper)" opacity=".08" />
      <path d="M100 168 C40 128 24 98 36 70 C48 44 84 42 100 68 C116 42 152 44 164 70 C176 98 160 128 100 168 Z" fill={u("a")} />
      <path d="M52 76 C58 62 72 58 84 64" fill="none" stroke="var(--color-paper)" strokeWidth="7" strokeLinecap="round" opacity=".6" />
    </>
  ),
  balloons: (u) => (
    <>
      <path d="M66 112 Q72 146 96 178 M134 104 Q128 140 104 178 M100 96 V178" fill="none" stroke="var(--color-paper)" strokeOpacity=".6" strokeWidth="2" />
      <ellipse cx="64" cy="82" rx="28" ry="34" fill={u("a")} />
      <ellipse cx="136" cy="76" rx="28" ry="34" fill="var(--color-scene-sky)" />
      <ellipse cx="100" cy="60" rx="30" ry="36" fill={u("l")} />
      <ellipse cx="90" cy="46" rx="7" ry="11" fill="var(--color-paper)" opacity=".55" />
      <ellipse cx="54" cy="70" rx="6" ry="10" fill="var(--color-paper)" opacity=".45" />
      {[[30, 150, "primary"], [168, 140, "scene-mint"], [44, 40, "lemon"], [170, 34, "coral"]].map(([x, y, c]) => (
        <rect key={`${x}`} x={x as number} y={y as number} width="8" height="4" rx="2" fill={`var(--color-${c})`} transform={`rotate(30 ${x} ${y})`} />
      ))}
    </>
  ),
};

/** SVG product silhouette. `uid` keeps gradient ids unique per instance. */
export function PropArt({ name, uid, className }: { name: PropName; uid: string; className?: string }) {
  const id = `p${uid.replace(/[^a-zA-Z0-9]/g, "")}`;
  const u = (k: string) => `url(#${id}${k})`;
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden focusable="false">
      <Defs id={id} />
      {DRAW[name](u)}
    </svg>
  );
}

/** Default visual per seed niche slug: scene palette + product silhouette. */
const NICHE_VISUALS: Record<string, [SceneName, PropName]> = {
  "real-estate": ["dusk", "house"],
  "real-estate-developers": ["sky", "building"],
  "aesthetic-clinics": ["blush", "dropper"],
  "beauty-nails": ["blush", "bottle"],
  "barbers-salons": ["teal", "scissors"],
  restaurants: ["amber", "plate"],
  "fitness-trainers": ["night", "dumbbell"],
  "yoga-pilates": ["sand", "heart"],
  "renovation-contractors": ["sand", "toolbox"],
  dentists: ["mint", "tooth"],
  "mortgage-advisors": ["sky", "house"],
  "event-venues": ["night", "balloons"],
  ecommerce: ["dusk", "bag"],
  "car-dealers": ["night", "car"],
  "auto-services": ["teal", "car"],
  lawyers: ["sky", "doc"],
  accountants: ["mint", "doc"],
  "insurance-agents": ["sky", "doc"],
  "interior-design": ["sand", "sofa"],
  "event-photographers": ["night", "camera"],
  "djs-musicians": ["night", "vinyl"],
  "zimmers-boutique-hotels": ["sky", "cabin"],
  "tourism-attractions": ["sky", "camera"],
  "courses-educators": ["mint", "books"],
  therapists: ["sand", "heart"],
  "vets-dog-grooming": ["amber", "paw"],
  "driving-schools": ["teal", "car"],
  "kids-activities": ["dusk", "balloons"],
  "home-services": ["amber", "toolbox"],
  "movers-storage": ["sand", "toolbox"],
  "retail-stores": ["blush", "bag"],
  "catering-chefs": ["amber", "plate"],
  "b2b-startups": ["night", "doc"],
  nonprofits: ["dusk", "heart"],
  "physio-nutrition": ["mint", "heart"],
};

export function nicheVisual(slug: string | null | undefined): { scene: SceneName; prop: PropName } {
  const v = (slug && NICHE_VISUALS[slug]) || (["dusk", "bag"] as [SceneName, PropName]);
  return { scene: v[0], prop: v[1] };
}
