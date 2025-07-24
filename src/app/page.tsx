"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-green-200 p-4">
      <div className="max-w-xl w-full text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-2">Agro-bootcamp</h1>
        <p className="text-lg md:text-xl text-green-900 mb-4">
          Plataforma de trazabilidad agrícola sobre blockchain Base L2. Registra, verifica y comparte la historia de tus productos agrícolas de forma transparente y segura.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/dashboard" className="btn-primary">Ir al Dashboard</Link>
          <Link href="/parcels" className="btn-secondary">Gestión de Parcelas</Link>
          <Link href="/events" className="btn-secondary">Bitácora de Eventos</Link>
          <Link href="/batches" className="btn-secondary">Generar Lotes Trazables</Link>
          <Link href="/scan" className="btn-secondary">Escanear QR</Link>
        </div>
        <div className="mt-8 text-xs text-green-700">
          <span>Hackathon Base L2 | Web3 + Agricultura</span>
        </div>
      </div>
    </main>
  );
}
