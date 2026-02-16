'use client'

import { useState, useEffect, useMemo } from 'react'
import { formatPrice } from '@/lib/utils'

interface Vehiculo {
  id: number
  marca: string
  modelo: string
  anio: number
  precio: number
  imagenes: string
}

// BNA Autos - Tasas vigentes desde 05/01/2026
// Tarjetahabientes BNA: TNA 34% | CFT TEA 49.86%
// No tarjetahabientes: TNA 38% | CFT TEA 57.02%
const TNA_TARJETAHABIENTE = 0.34
const TNA_NO_TARJETAHABIENTE = 0.38

// Plazos disponibles BNA Autos (hasta 72 meses)
const PLAZOS = [12, 18, 24, 36, 48, 60, 72]

function calcularCuotaFrances(monto: number, plazoMeses: number, tna: number): number {
  const tasaMensual = tna / 12
  if (tasaMensual === 0) return Math.round(monto / plazoMeses)
  const cuota = monto * (tasaMensual * Math.pow(1 + tasaMensual, plazoMeses)) / (Math.pow(1 + tasaMensual, plazoMeses) - 1)
  return Math.round(cuota)
}

export function SimuladorFinanciamiento() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [selectedVehiculo, setSelectedVehiculo] = useState<Vehiculo | null>(null)
  const [dineroDisponible, setDineroDisponible] = useState<string>('')
  const [marcaFiltro, setMarcaFiltro] = useState<string>('')
  const [esTarjetahabiente, setEsTarjetahabiente] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const response = await fetch('/api/vehiculos')
        if (response.ok) {
          const data = await response.json()
          setVehiculos(data.filter((v: Vehiculo & { activo: boolean }) => v.activo))
        }
      } catch (error) {
        console.error('Error fetching vehiculos:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchVehiculos()
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowModal(false)
    }
    if (showModal) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [showModal])

  const marcasUnicas = useMemo(() => {
    const marcas = Array.from(new Set(vehiculos.map(v => v.marca)))
    return marcas.sort()
  }, [vehiculos])

  const vehiculosFiltrados = useMemo(() => {
    if (!marcaFiltro) return vehiculos
    return vehiculos.filter(v => v.marca === marcaFiltro)
  }, [vehiculos, marcaFiltro])

  const dineroNum = parseFloat(dineroDisponible.replace(/[^0-9]/g, '')) || 0
  const diferencia = selectedVehiculo ? Math.max(0, selectedVehiculo.precio - dineroNum) : 0
  const tna = esTarjetahabiente ? TNA_TARJETAHABIENTE : TNA_NO_TARJETAHABIENTE

  const handleDineroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setDineroDisponible(value)
  }

  const getImageUrl = (vehiculo: Vehiculo) => {
    try {
      const imagenes = JSON.parse(vehiculo.imagenes || '[]')
      return imagenes[0] || '/placeholder-car.svg'
    } catch {
      return '/placeholder-car.svg'
    }
  }

  const handleCotizar = () => {
    if (diferencia > 0 && selectedVehiculo) {
      setShowModal(true)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gervasio-blue"></div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda: Selector de vehiculos */}
        <div className="lg:col-span-2 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <label className="text-sm font-medium text-gray-700">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gervasio-blue text-white text-xs font-bold mr-2">1</span>
              Elegi el auto que queres
            </label>
            <select
              value={marcaFiltro}
              onChange={(e) => {
                setMarcaFiltro(e.target.value)
                if (e.target.value && selectedVehiculo && selectedVehiculo.marca !== e.target.value) {
                  setSelectedVehiculo(null)
                }
              }}
              className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-gervasio-blue transition-colors"
            >
              <option value="">Todas las marcas</option>
              {marcasUnicas.map((marca) => (
                <option key={marca} value={marca}>{marca}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[320px] overflow-y-auto pr-1">
            {vehiculosFiltrados.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500 text-sm">
                No hay vehiculos disponibles
              </div>
            ) : (
              vehiculosFiltrados.map((vehiculo) => (
                <button
                  key={vehiculo.id}
                  onClick={() => setSelectedVehiculo(vehiculo)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                    selectedVehiculo?.id === vehiculo.id
                      ? 'border-gervasio-blue bg-gervasio-blue/10'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={getImageUrl(vehiculo)}
                      alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-car.svg'
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-900 font-medium text-sm truncate">
                      {vehiculo.marca} {vehiculo.modelo}
                    </p>
                    <p className="text-xs text-gray-400">{vehiculo.anio}</p>
                    <p className="text-gervasio-blue font-semibold text-sm">
                      {formatPrice(vehiculo.precio)}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Columna derecha: Calculos */}
        <div className="lg:col-span-1 bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex flex-col">
          {/* Input dinero */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gervasio-blue text-white text-xs font-bold mr-2">2</span>
              Cuanto tenes para entregar?
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
              <input
                type="text"
                value={dineroDisponible ? parseInt(dineroDisponible).toLocaleString('es-AR') : ''}
                onChange={handleDineroChange}
                placeholder="0"
                className="w-full bg-white border border-gray-300 rounded-xl py-3 pl-8 pr-4 text-gray-900 text-lg font-semibold placeholder-gray-400 focus:outline-none focus:border-gervasio-blue transition-colors"
              />
            </div>
          </div>

          {/* Selector tarjetahabiente */}
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={esTarjetahabiente}
                onChange={(e) => setEsTarjetahabiente(e.target.checked)}
                className="w-4 h-4 text-gervasio-blue border-gray-300 rounded focus:ring-gervasio-blue"
              />
              <span className="text-sm text-gray-700">Tengo tarjeta de credito BNA</span>
            </label>
            <p className="text-xs text-gray-400 mt-1 ml-6">
              TNA {esTarjetahabiente ? '34%' : '38%'} - {esTarjetahabiente ? 'Tarjetahabiente' : 'No tarjetahabiente'}
            </p>
          </div>

          {/* Resultado */}
          <div className={`bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200 flex-1 ${selectedVehiculo ? 'opacity-100' : 'opacity-50'}`}>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Precio del vehiculo</span>
                <span className="text-gray-900 font-medium">
                  {selectedVehiculo ? formatPrice(selectedVehiculo.precio) : '-'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Tu entrega</span>
                <span className="text-green-400 font-medium">- {formatPrice(dineroNum)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-semibold">A financiar</span>
                  <span className="text-2xl font-bold text-gervasio-blue">
                    {selectedVehiculo ? formatPrice(diferencia) : '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Boton cotizar */}
          <button
            onClick={handleCotizar}
            disabled={!selectedVehiculo || diferencia <= 0}
            className={`w-full py-3 rounded-xl font-bold text-base transition-all ${
              selectedVehiculo && diferencia > 0
                ? 'bg-gervasio-blue text-white hover:bg-gervasio-blue-dark'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {!selectedVehiculo
              ? 'Elegi un vehiculo'
              : diferencia <= 0
              ? 'Tenes el monto completo!'
              : 'Calcular financiacion'}
          </button>

          {selectedVehiculo && diferencia > 0 && (
            <p className="text-center text-xs text-gray-500 mt-2">
              Financiacion +Autos con BNA
            </p>
          )}
        </div>
      </div>

      {/* Modal de cuotas */}
      {showModal && selectedVehiculo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false)
          }}
        >
          <div className="bg-dark-800 rounded-2xl border border-dark-600 w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-dark-900 px-6 py-4 border-b border-dark-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Plan de Cuotas - BNA Autos</h3>
                  <p className="text-sm text-gray-400">
                    {selectedVehiculo.marca} {selectedVehiculo.modelo} {selectedVehiculo.anio}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-dark-700 text-gray-400 hover:text-white hover:bg-dark-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Monto a financiar */}
              <div className="mt-4 bg-gervasio-blue/10 border border-gervasio-blue/30 rounded-xl p-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Monto a financiar:</span>
                  <span className="text-2xl font-bold text-gervasio-blue">{formatPrice(diferencia)}</span>
                </div>
              </div>

              {/* Info de tasa */}
              <p className="text-xs text-gray-500 mt-2">
                TNA {(tna * 100).toFixed(0)}% - Sistema frances - {esTarjetahabiente ? 'Tarjetahabiente BNA' : 'No tarjetahabiente'}
              </p>
            </div>

            {/* Tabla de cuotas */}
            <div className="p-4 overflow-y-auto max-h-[50vh]">
              <div className="grid grid-cols-2 gap-3">
                {PLAZOS.map((plazo) => {
                  const cuota = calcularCuotaFrances(diferencia, plazo, tna)
                  const total = cuota * plazo
                  return (
                    <div
                      key={plazo}
                      className="bg-dark-700 border border-dark-600 rounded-xl p-4 hover:border-gervasio-blue/50 transition-colors"
                    >
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="text-2xl font-bold text-white">{plazo}</span>
                        <span className="text-xs text-gray-400">cuotas</span>
                      </div>
                      <div className="text-lg font-bold text-gervasio-blue">
                        {formatPrice(cuota)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Total: {formatPrice(total)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-dark-900 px-6 py-4 border-t border-dark-700">
              <p className="text-xs text-gray-500 text-center mb-3">
                +Autos con BNA. Cuotas fijas en pesos. Sujeto a aprobacion crediticia. Monto max $100.000.000.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-sm border border-dark-600 text-gray-300 hover:bg-dark-700 transition-colors"
                >
                  Cerrar
                </button>
                <a
                  href={`https://wa.me/5493407123456?text=Hola! Quiero consultar por la financiacion BNA del ${selectedVehiculo.marca} ${selectedVehiculo.modelo} ${selectedVehiculo.anio}. Monto a financiar: ${formatPrice(diferencia)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl font-semibold text-sm bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Consultar
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
