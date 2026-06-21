// Kawaii-style pet illustrations matching the reference infographic style.
// Simple rounded shapes, clean flat colors, minimal details.

/** Beige puppy — reference image 3 (simple round dog) */
export function IlluDog({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 130 140" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Body */}
      <ellipse cx="65" cy="118" rx="36" ry="22" fill="#e8c88a" />
      {/* Left ear (floppy, behind head) */}
      <ellipse cx="28" cy="72" rx="18" ry="28" fill="#b8783a" transform="rotate(-8,28,72)" />
      {/* Right ear */}
      <ellipse cx="102" cy="72" rx="18" ry="28" fill="#b8783a" transform="rotate(8,102,72)" />
      {/* Head */}
      <circle cx="65" cy="72" r="42" fill="#f0d8a0" />
      {/* Brown forehead spot */}
      <ellipse cx="65" cy="52" rx="22" ry="16" fill="#c89050" opacity="0.7" />
      {/* Left eye */}
      <circle cx="48" cy="68" r="9" fill="#1c120a" />
      <circle cx="51" cy="65" r="3" fill="white" />
      {/* Right eye */}
      <circle cx="82" cy="68" r="9" fill="#1c120a" />
      <circle cx="85" cy="65" r="3" fill="white" />
      {/* Snout */}
      <ellipse cx="65" cy="83" rx="18" ry="13" fill="#f8e8c0" />
      {/* Nose */}
      <ellipse cx="65" cy="77" rx="8" ry="6" fill="#2a1810" />
      <ellipse cx="63" cy="76" rx="2.5" ry="1.5" fill="rgba(255,255,255,0.3)" />
      {/* Mouth */}
      <path d="M56,88 Q65,95 74,88" fill="none" stroke="#9a6030" strokeWidth="2" strokeLinecap="round" />
      {/* Tongue */}
      <ellipse cx="65" cy="94" rx="8" ry="5" fill="#e87090" />
      {/* Blush */}
      <circle cx="33" cy="82" r="10" fill="#f09898" opacity="0.38" />
      <circle cx="97" cy="82" r="10" fill="#f09898" opacity="0.38" />
    </svg>
  )
}

/** Orange tabby — rounded oval body+head unified, dark ear tips, closed arc eyes */
export function IlluCat({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 145" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Unified body+head oval */}
      <ellipse cx="60" cy="86" rx="52" ry="58" fill="#e8a030" />
      {/* Organic darker patches */}
      <path d="M64,54 C74,46 92,50 94,66 C96,80 86,94 76,96 C66,98 60,86 60,74 C60,62 56,60 64,54Z" fill="#c07820" opacity="0.72" />
      <path d="M26,64 C20,56 20,68 24,78 C28,88 40,88 44,78 C48,68 36,56 26,64Z" fill="#c07820" opacity="0.68" />
      <path d="M44,110 C42,102 52,98 62,102 C72,106 76,118 68,122 C58,126 46,120 44,110Z" fill="#c07820" opacity="0.62" />
      <path d="M80,98 C86,92 94,96 96,106 C98,116 90,120 84,116 C78,112 76,102 80,98Z" fill="#c07820" opacity="0.6" />
      {/* Left ear — dark tip */}
      <path d="M18,44 L8,12 L40,34 Z" fill="#e8a030" />
      <path d="M20,42 L12,16 L38,33 Z" fill="#1a1008" />
      {/* Right ear — dark tip */}
      <path d="M102,44 L112,12 L80,34 Z" fill="#e8a030" />
      <path d="M100,42 L108,16 L82,33 Z" fill="#1a1008" />
      {/* Left eye — closed happy arc */}
      <path d="M28,72 Q38,63 48,72" fill="none" stroke="#1a1008" strokeWidth="3.5" strokeLinecap="round" />
      {/* Right eye — closed happy arc */}
      <path d="M72,72 Q82,63 92,72" fill="none" stroke="#1a1008" strokeWidth="3.5" strokeLinecap="round" />
      {/* Nose — small downward triangle */}
      <path d="M56,86 L60,92 L64,86 Z" fill="#1a1008" />
      {/* Smile */}
      <path d="M54,94 Q60,100 66,94" fill="none" stroke="#1a1008" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/** Gray/white cat sitting — reference image 2 */
export function IlluRabbit({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Body */}
      <ellipse cx="60" cy="118" rx="32" ry="26" fill="#c8c4c0" />
      {/* Belly */}
      <ellipse cx="60" cy="120" rx="16" ry="14" fill="#f0eee8" />
      {/* Tail */}
      <circle cx="88" cy="130" r="9" fill="#f0eee8" />
      {/* Left ear */}
      <polygon points="32,56 20,22 52,48" fill="#b0acaa" />
      <polygon points="34,53 26,28 50,47" fill="#e8d4d8" />
      {/* Right ear */}
      <polygon points="88,56 100,22 68,48" fill="#b0acaa" />
      <polygon points="86,53 94,28 70,47" fill="#e8d4d8" />
      {/* Head */}
      <circle cx="60" cy="68" r="40" fill="#d8d4d0" />
      {/* Inner face lighter patch */}
      <ellipse cx="60" cy="76" rx="24" ry="20" fill="#f0eee8" />
      {/* Left eye */}
      <circle cx="44" cy="62" r="9" fill="#1c1a18" />
      <circle cx="47" cy="59" r="3" fill="white" />
      {/* Right eye */}
      <circle cx="76" cy="62" r="9" fill="#1c1a18" />
      <circle cx="79" cy="59" r="3" fill="white" />
      {/* Nose */}
      <ellipse cx="60" cy="76" rx="5" ry="4" fill="#e08898" />
      {/* Mouth */}
      <path d="M57,80 Q60,84 63,80" fill="none" stroke="#c06070" strokeWidth="1.5" strokeLinecap="round" />
      {/* Whiskers left */}
      <line x1="22" y1="76" x2="50" y2="77" stroke="#9a9090" strokeWidth="1.2" opacity="0.6" />
      <line x1="22" y1="82" x2="50" y2="80" stroke="#9a9090" strokeWidth="1.2" opacity="0.6" />
      {/* Whiskers right */}
      <line x1="98" y1="76" x2="70" y2="77" stroke="#9a9090" strokeWidth="1.2" opacity="0.6" />
      <line x1="98" y1="82" x2="70" y2="80" stroke="#9a9090" strokeWidth="1.2" opacity="0.6" />
    </svg>
  )
}

/** Cute parrot — matching the same kawaii illustration style */
export function IlluParrot({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Body */}
      <ellipse cx="60" cy="118" rx="30" ry="26" fill="#40b030" />
      {/* Wing */}
      <ellipse cx="36" cy="116" rx="14" ry="22" fill="#2e9820" transform="rotate(-15,36,116)" />
      <ellipse cx="84" cy="116" rx="14" ry="22" fill="#2e9820" transform="rotate(15,84,116)" />
      {/* Belly */}
      <ellipse cx="60" cy="120" rx="16" ry="14" fill="#c8e870" />
      {/* Tail feathers */}
      <ellipse cx="50" cy="142" rx="7" ry="14" fill="#228018" transform="rotate(-15,50,142)" />
      <ellipse cx="60" cy="144" rx="7" ry="14" fill="#2e9820" />
      <ellipse cx="70" cy="142" rx="7" ry="14" fill="#228018" transform="rotate(15,70,142)" />
      {/* Crown feather */}
      <ellipse cx="60" cy="24" rx="6" ry="14" fill="#40b030" transform="rotate(-10,60,24)" />
      <ellipse cx="70" cy="22" rx="6" ry="14" fill="#60c840" transform="rotate(10,70,22)" />
      {/* Head */}
      <circle cx="60" cy="66" r="40" fill="#50c038" />
      {/* White cheek + face patch */}
      <ellipse cx="64" cy="72" rx="24" ry="22" fill="#f4f4e0" />
      {/* Eye */}
      <circle cx="48" cy="60" r="13" fill="white" />
      <circle cx="48" cy="60" r="9" fill="#d4c020" />
      <circle cx="48" cy="60" r="6" fill="#1a1808" />
      <circle cx="44" cy="57" r="2" fill="white" />
      {/* Beak upper */}
      <path d="M64,70 Q82,64 85,73 Q82,80 64,79 Z" fill="#e8a020" />
      {/* Beak lower */}
      <path d="M64,79 Q80,80 83,75 Q80,84 64,82 Z" fill="#c07810" />
      {/* Beak line */}
      <path d="M64,79 Q78,77 83,73" stroke="#a06010" strokeWidth="1" fill="none" opacity="0.5" />
      {/* Red cheek spot */}
      <circle cx="82" cy="64" r="7" fill="#f04848" opacity="0.5" />
    </svg>
  )
}
