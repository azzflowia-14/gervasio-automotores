interface LogoTextProps {
  variant?: 'default' | 'white' | 'hero'
  className?: string
}

export function LogoText({ variant = 'default', className = '' }: LogoTextProps) {
  const isWhite = variant === 'white'
  const isHero = variant === 'hero'
  // navbar on blue bg = light, footer on dark bg = light, hero on white bg = dark
  const light = isWhite

  const mainColor = light ? 'text-white' : 'text-gray-900'
  const accentColor = light ? 'text-white/90' : 'text-[#006fbe]'

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      {/* AUTOMOTORES */}
      <span
        className={`tracking-[0.3em] uppercase ${mainColor} ${
          isHero
            ? 'text-xs md:text-xl mb-0'
            : 'text-[7px] md:text-[9px] mb-0'
        }`}
        style={{ fontFamily: "'Modern Warfare', sans-serif" }}
      >
        AUTOMOTORES
      </span>

      {/* GERVASIO */}
      <span
        className={`uppercase block ${mainColor} ${
          isHero
            ? 'text-5xl md:text-8xl leading-[0.85]'
            : 'text-2xl md:text-3xl leading-[0.85]'
        }`}
        style={{ fontFamily: "'Modern Warfare', sans-serif" }}
      >
        GERVASIO
      </span>

      {/* E HIJOS */}
      <span
        className={`tracking-[0.2em] uppercase self-end ${accentColor} ${
          isHero
            ? 'text-sm md:text-2xl mt-0'
            : 'text-[8px] md:text-[10px] mt-0'
        }`}
        style={{ fontFamily: "'Modern Warfare', sans-serif" }}
      >
        E HIJOS
      </span>
    </div>
  )
}
