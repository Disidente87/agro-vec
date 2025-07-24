"use client";
import React from "react";
import Link from "next/link";

// Dashboard principal: muestra resumen y accesos rápidos
const DashboardPage: React.FC = () => {
  return (
    <main className="max-w-3xl mx-auto py-8 px-2 space-y-6">
      <h2 className="text-2xl font-bold text-green-800 mb-2">Dashboard</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* Métricas básicas */}
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-3xl font-bold text-green-700">0</div>
          <div className="text-xs text-green-900">Parcelas</div>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-3xl font-bold text-green-700">0</div>
          <div className="text-xs text-green-900">Eventos</div>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-3xl font-bold text-green-700">0</div>
          <div className="text-xs text-green-900">Lotes</div>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-3xl font-bold text-green-700">0</div>
          <div className="text-xs text-green-900">Certificaciones</div>
        </div>
      </div>
      {/* Accesos rápidos */}
      <div className="flex flex-col md:flex-row gap-3 mt-6">
        <Link href="/parcels" className="btn-primary w-full md:w-auto">Gestionar Parcelas</Link>
        <Link href="/events" className="btn-secondary w-full md:w-auto">Bitácora de Eventos</Link>
        <Link href="/batches" className="btn-secondary w-full md:w-auto">Generar Lote</Link>
      </div>
    </main>
  );
};

export default DashboardPage; 