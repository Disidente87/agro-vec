"use client";
import React from "react";

// Página para escanear QR codes
const ScanPage: React.FC = () => {
  return (
    <main className="max-w-md mx-auto py-8 px-2 space-y-6">
      <h2 className="text-2xl font-bold text-green-800 mb-2">Escanear QR</h2>
      {/* Acceso a cámara y escaneo (placeholder) */}
      <div className="bg-white rounded shadow p-4 text-green-700">
        Acceso a cámara y escaneo de QR (próximamente)
      </div>
    </main>
  );
};

export default ScanPage; 