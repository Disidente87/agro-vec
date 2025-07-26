"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { ROLE_LABELS } from "@/types/auth";

export default function Home() {
  const { user, isAuthenticated, hasPermission } = useAuth();

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

        {/* Authentication Status */}
        {isAuthenticated && user ? (
          <div className="bg-white rounded-lg p-6 shadow-md mb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800">Conectado</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-2">{user.name}</p>
            <p className="text-sm text-gray-600 mb-3">
              {user.address.slice(0, 6)}...{user.address.slice(-4)}
            </p>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              {ROLE_LABELS[user.role]}
            </span>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              🔐 Conecta tu wallet de Base para acceder a todas las funcionalidades
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
          <Link 
            href="/dashboard" 
            className="btn-primary text-center py-4 px-6 text-lg font-semibold"
          >
            📊 Dashboard
          </Link>
          
          {hasPermission('canViewAllData') && (
            <Link 
              href="/parcels" 
              className="btn-secondary text-center py-4 px-6 text-lg font-semibold"
            >
              🏞️ Gestión de Parcelas
            </Link>
          )}
          
          {hasPermission('canCreateEvents') && (
            <Link 
              href="/events" 
              className="btn-secondary text-center py-4 px-6 text-lg font-semibold"
            >
              📝 Bitácora de Eventos
            </Link>
          )}
          
          {hasPermission('canCreateBatches') && (
            <Link 
              href="/batches" 
              className="btn-secondary text-center py-4 px-6 text-lg font-semibold"
            >
              📦 Generar Lotes Trazables
            </Link>
          )}
          
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
