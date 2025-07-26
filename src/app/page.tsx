"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-green-200 p-4">
      <div className="max-w-xl w-full text-center space-y-6">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-2">🌱 Agro-bootcamp</h1>
          <p className="text-lg md:text-xl text-green-900 mb-4">
            Trazabilidad agrícola sobre blockchain Base L2
          </p>
          <p className="text-sm text-green-700">
            Registra, verifica y comparte la historia de tus productos agrícolas de forma transparente y segura.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
          <Link 
            href="/dashboard" 
            className="btn-primary text-center py-4 px-6 text-lg font-semibold"
          >
            📊 Dashboard
          </Link>
          <Link 
            href="/parcels" 
            className="btn-secondary text-center py-4 px-6 text-lg font-semibold"
          >
            🏞️ Gestión de Parcelas
          </Link>
          <Link 
            href="/events" 
            className="btn-secondary text-center py-4 px-6 text-lg font-semibold"
          >
            📝 Bitácora de Eventos
          </Link>
          <Link 
            href="/batches" 
            className="btn-secondary text-center py-4 px-6 text-lg font-semibold"
          >
            📦 Generar Lotes Trazables
          </Link>
          <Link 
            href="/scan" 
            className="btn-secondary text-center py-4 px-6 text-lg font-semibold"
          >
            📱 Escanear QR
          </Link>
        </div>
        
        <div className="mt-8 text-xs text-green-700">
          <span>Hackathon Base L2 | Web3 + Agricultura</span>
        </div>
      </div>
    </main>
  );
}
