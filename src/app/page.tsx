"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";

export default function Home() {
  // DEBUG TEMPORAL - Verificar variables de entorno
  console.log('🔍 DEBUG - Variables de entorno:');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Existe' : '❌ No existe');
  console.log('🔍 FIN DEBUG');
  
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
        {!isAuthenticated && (
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
          
          {isAuthenticated && (
            <Link 
              href="/profile" 
              className="btn-secondary text-center py-4 px-6 text-lg font-semibold"
            >
              👤 Ver Mi Perfil
            </Link>
          )}
          
          {/* Gestión de Parcelas - Solo para productores y técnicos */}
          {(hasPermission('canCreateParcels') || hasPermission('canEditParcels')) && (
            <Link 
              href="/parcels" 
              className="btn-secondary text-center py-4 px-6 text-lg font-semibold"
            >
              🏞️ Gestión de Parcelas
            </Link>
          )}
          
          {/* Bitácora de Eventos - Solo para productores y técnicos */}
          {(hasPermission('canCreateEvents') || hasPermission('canEditEvents')) && (
            <Link 
              href="/events" 
              className="btn-secondary text-center py-4 px-6 text-lg font-semibold"
            >
              📝 Bitácora de Eventos
            </Link>
          )}
          
          {/* Generar Lotes - Solo para productores y distribuidores */}
          {(hasPermission('canCreateBatches') || hasPermission('canEditBatches')) && (
            <Link 
              href="/batches" 
              className="btn-secondary text-center py-4 px-6 text-lg font-semibold"
            >
              📦 Generar Lotes Trazables
            </Link>
          )}
          
          {/* Escanear QR - Disponible para todos los usuarios autenticados */}
          {isAuthenticated && (
            <Link 
              href="/scan" 
              className="btn-secondary text-center py-4 px-6 text-lg font-semibold"
            >
              📱 Escanear QR
            </Link>
          )}
        </div>
        
        <div className="mt-8 text-xs text-green-700">
          <span>Hackathon Base L2 | Web3 + Agricultura</span>
        </div>
      </div>
    </main>
  );
}
