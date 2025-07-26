"use client";
import React from "react";

// Página de gestión de parcelas
const ParcelsPage: React.FC = () => {
  return (
    <main className="max-w-2xl mx-auto py-8 px-2 space-y-6">
      <h2 className="text-2xl font-bold text-green-800 mb-2">Parcelas</h2>
      {/* Lista de parcelas (placeholder) */}
      <div className="bg-white rounded shadow p-4 text-center text-green-700">
        No hay parcelas registradas aún.
      </div>
      <div className="flex justify-end">
        <button className="btn-primary">Crear Parcela</button>
      </div>
    </main>
  );
};

export default ParcelsPage; 