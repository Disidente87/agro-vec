"use client";
import React from "react";
import { useParams } from "next/navigation";

// Vista pública de QR escaneado
const TracePage: React.FC = () => {
  const params = useParams();
  const qrCode = params?.qr_code;
  return (
    <main className="max-w-2xl mx-auto py-8 px-2 space-y-6">
      <h2 className="text-2xl font-bold text-green-800 mb-2">Trazabilidad del Producto</h2>
      <div className="bg-white rounded shadow p-4 text-green-700">
        Historial completo del producto para QR: <span className="font-mono">{qrCode}</span>
      </div>
      {/* Mapa de origen (placeholder) */}
      <div className="bg-green-100 rounded p-4 mt-4 text-green-800">
        Mapa de ubicación del origen (próximamente)
      </div>
    </main>
  );
};

export default TracePage; 