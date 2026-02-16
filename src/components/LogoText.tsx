interface LogoTextProps {
  variant?: 'default' | 'white' | 'hero'
  className?: string
}

export function LogoText({ variant = 'default', className = '' }: LogoTextProps) {
  const isHero = variant === 'hero'
  const isWhite = variant === 'white'
  const light = isWhite || isHero

  const mainColor = light ? 'text-white' : 'text-gray-900'
  const accentColor = light ? 'text-white/90' : 'text-[#006fbe]'
  const lineColor = light ? 'bg-white/80' : 'bg-[#006fbe]'

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      {/* AUTOMOTORES */}
      <span
        className={`tracking-[0.3em] uppercase ${mainColor} ${
          isHero
            ? 'text-base md:text-2xl mb-1'
            : isWhite
            ? 'text-[8px] mb-0.5'
            : 'text-[8px] md:text-[10px] mb-0.5'
        }`}
        style={{ fontFamily: "'Modern Warfare', sans-serif" }}
      >
        AUTOMOTORES
      </span>

      {/* GERVASIO con línea azul */}
      <div className="relative inline-block">
        <span
          className={`uppercase leading-[0.9] block ${mainColor} ${
            isHero
              ? 'text-7xl md:text-[10rem]'
              : isWhite
              ? 'text-2xl'
              : 'text-3xl md:text-4xl'
          }`}
          style={{ fontFamily: "'Modern Warfare', sans-serif" }}
        >
          GERVASIO
        </span>
        {/* Línea decorativa azul */}
        <div
          className={`absolute left-0 right-0 ${lineColor}`}
          style={{
            bottom: '20%',
            height: isHero ? '3px' : '1.5px',
          }}
        ></div>
      </div>

      {/* E HIJOS */}
      <span
        className={`tracking-[0.2em] uppercase self-end ${accentColor} ${
          isHero
            ? 'text-lg md:text-3xl -mt-1'
            : isWhite
            ? 'text-[8px]'
            : 'text-[9px] md:text-xs'
        }`}
        style={{ fontFamily: "'Modern Warfare', sans-serif" }}
      >
        E HIJOS
      </span>
    </div>
  )
}
