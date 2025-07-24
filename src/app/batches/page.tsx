"use client";
import React from "react";

// Página para generación de lotes trazables
const BatchesPage: React.FC = () => {
  return (
    <main className="max-w-2xl mx-auto py-8 px-2 space-y-6">
      <h2 className="text-2xl font-bold text-green-800 mb-2">Generar Lote Trazable</h2>
      {/* Wizard para crear lote (placeholder) */}
      <div className="bg-white rounded shadow p-4 text-green-700">
        Wizard para seleccionar eventos y generar lote
      </div>
      {/* Preview de QR (placeholder) */}
      <div className="bg-green-100 rounded p-4 mt-4 text-green-800">
        Preview del QR generado
      </div>
    </main>
  );
};

export default BatchesPage; 