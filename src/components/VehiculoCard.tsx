import Link from 'next/link'
import Image from 'next/image'
import { formatPrice, formatKilometraje } from '@/lib/utils'
import { Card } from './ui/Card'

interface Vehiculo {
  id: number
  marca: string
  modelo: string
  anio: number
  precio: number
  kilometraje: number
  tipo: string
  estado: string
  color: string
  transmision: string
  combustible: string
  imagenes: string
  destacado: boolean
}

interface VehiculoCardProps {
  vehiculo: Vehiculo
}

export function VehiculoCard({ vehiculo }: VehiculoCardProps) {
  const imagenesArray: string[] = (() => {
    try {
      return JSON.parse(vehiculo.imagenes || '[]')
    } catch {
      return []
    }
  })()

  const primeraImagen = imagenesArray[0]

  const estadoColors: Record<string, string> = {
    nuevo: 'bg-gervasio-blue text-white',
    usado: 'bg-gray-500 text-white',
    certificado: 'bg-green-600 text-white',
  }

  const estadoLabels: Record<string, string> = {
    nuevo: '0KM',
    usado: 'Usado',
    certificado: 'Certificado',
  }

  return (
    <Card className="group bg-white border-gray-200 hover:border-gervasio-blue/50 transition-all duration-300 shadow-sm">
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
        {primeraImagen ? (
          <Image
            src={primeraImagen}
            alt={`${vehiculo.marca} ${vehiculo.modelo}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {vehiculo.destacado && (
          <span className="absolute top-3 left-3 bg-gervasio-blue text-white text-xs font-bold uppercase px-2 py-1 rounded">
            Destacado
          </span>
        )}
        <span className={`absolute top-3 right-3 text-xs font-bold uppercase px-2 py-1 rounded ${estadoColors[vehiculo.estado] || 'bg-gray-500 text-white'}`}>
          {estadoLabels[vehiculo.estado] || vehiculo.estado}
        </span>
      </div>

      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-gervasio-blue transition-colors">
            {vehiculo.marca} {vehiculo.modelo}
          </h3>
          <p className="text-sm text-gray-500">{vehiculo.anio}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded capitalize">
            {vehiculo.transmision}
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded capitalize">
            {vehiculo.combustible}
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {formatKilometraje(vehiculo.kilometraje)}
          </span>
        </div>

        <div className="flex flex-col gap-3 pt-3 border-t border-gray-200">
          <p className="text-xl font-black text-gervasio-blue">
            {formatPrice(vehiculo.precio)}
          </p>
          <Link
            href={`/catalogo/${vehiculo.id}`}
            className="text-sm font-semibold bg-gervasio-blue hover:bg-gervasio-blue-dark text-white px-4 py-2 rounded-lg transition-colors uppercase tracking-wide flex items-center justify-center gap-1 group/btn"
          >
            Ver más
            <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </Card>
  )
}
