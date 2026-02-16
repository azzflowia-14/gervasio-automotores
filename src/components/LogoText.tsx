interface LogoTextProps {
  variant?: 'default' | 'white' | 'hero'
  className?: string
}

export function LogoText({ variant = 'default', className = '' }: LogoTextProps) {
  const isWhite = variant === 'white'
  // hero uses dark colors (on white bg), white uses light colors (on dark bg)
  const light = isWhite

  const mainColor = light ? 'text-white' : 'text-gray-900'
  const accentColor = light ? 'text-white/90' : 'text-[#006fbe]'

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      {/* AUTOMOTORES */}
      <span
        className={`tracking-[0.3em] uppercase ${mainColor} ${
          variant === 'hero'
            ? 'text-base md:text-2xl mb-0.5'
            : isWhite
            ? 'text-[8px] mb-0'
            : 'text-[8px] md:text-[10px] mb-0'
        }`}
        style={{ fontFamily: "'Modern Warfare', sans-serif" }}
      >
        AUTOMOTORES
      </span>

      {/* GERVASIO */}
      <span
        className={`uppercase block ${mainColor} ${
          variant === 'hero'
            ? 'text-7xl md:text-[10rem] leading-[0.8]'
            : isWhite
            ? 'text-2xl leading-[0.8]'
            : 'text-3xl md:text-4xl leading-[0.8]'
        }`}
        style={{ fontFamily: "'Modern Warfare', sans-serif" }}
      >
        GERVASIO
      </span>

      {/* E HIJOS */}
      <span
        className={`tracking-[0.2em] uppercase self-end ${accentColor} ${
          variant === 'hero'
            ? 'text-lg md:text-3xl mt-0'
            : isWhite
            ? 'text-[8px] mt-0'
            : 'text-[9px] md:text-xs mt-0'
        }`}
        style={{ fontFamily: "'Modern Warfare', sans-serif" }}
      >
        E HIJOS
      </span>
    </div>
  )
}
