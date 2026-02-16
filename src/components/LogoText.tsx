interface LogoTextProps {
  variant?: 'default' | 'white' | 'hero'
  className?: string
}

export function LogoText({ variant = 'default', className = '' }: LogoTextProps) {
  const isWhite = variant === 'white'
  const isHero = variant === 'hero'
  const light = isWhite || isHero

  const mainColor = light ? 'text-white' : 'text-gray-900'
  const accentColor = light ? 'text-white/90' : 'text-[#006fbe]'
  const lineColor = light ? 'bg-white/80' : 'bg-[#006fbe]'

  // Scale based on variant
  const scale = isHero ? 'scale-hero' : variant === 'white' ? 'scale-footer' : 'scale-nav'

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      {/* AUTOMOTORES */}
      <span
        className={`font-[var(--font-michroma)] font-normal uppercase ${mainColor} ${
          scale === 'scale-hero'
            ? 'text-sm md:text-xl tracking-[0.35em]'
            : scale === 'scale-footer'
            ? 'text-[7px] tracking-[0.3em]'
            : 'text-[7px] md:text-[9px] tracking-[0.3em]'
        }`}
      >
        AUTOMOTORES
      </span>

      {/* GERVASIO con línea azul y efecto skew */}
      <div className="relative inline-block">
        <span
          className={`font-[var(--font-michroma)] font-normal uppercase leading-[0.85] block ${mainColor} ${
            scale === 'scale-hero'
              ? 'text-6xl md:text-9xl tracking-tight'
              : scale === 'scale-footer'
              ? 'text-xl tracking-tight'
              : 'text-2xl md:text-3xl tracking-tight'
          }`}
          style={{
            transform: 'skewX(-8deg)',
            fontWeight: 400,
          }}
        >
          GERV
          {/* A con extensión hacia abajo */}
          <span className="relative inline-block">
            A
            <span
              className={`absolute bottom-0 left-0 w-[0.15em] ${light ? 'bg-white' : 'bg-gray-900'}`}
              style={{
                height: '0.2em',
                transform: 'translateY(0.15em) skewX(-4deg)',
              }}
            ></span>
          </span>
          SIO
        </span>
        {/* Línea decorativa azul */}
        <div
          className={`absolute left-0 right-0 ${lineColor}`}
          style={{
            bottom: '18%',
            height: scale === 'scale-hero' ? '3px' : '1.5px',
            transform: 'skewX(-8deg)',
          }}
        ></div>
      </div>

      {/* E HIJOS */}
      <span
        className={`font-[var(--font-michroma)] font-normal uppercase self-end ${accentColor} ${
          scale === 'scale-hero'
            ? 'text-base md:text-2xl tracking-[0.2em] -mt-1'
            : scale === 'scale-footer'
            ? 'text-[7px] tracking-[0.15em]'
            : 'text-[8px] md:text-[10px] tracking-[0.15em]'
        }`}
      >
        E HIJOS
      </span>
    </div>
  )
}
