"use client";
import React from "react";

// Página de bitácora de eventos agrícolas
const EventsPage: React.FC = () => {
  return (
    <main className="max-w-2xl mx-auto py-8 px-2 space-y-6">
      <h2 className="text-2xl font-bold text-green-800 mb-2">Bitácora de Eventos</h2>
      {/* Formulario dinámico para eventos (placeholder) */}
      <div className="bg-white rounded shadow p-4 text-green-700">
        Formulario para registrar evento agrícola (siembra, riego, etc.)
      </div>
      {/* Timeline visual (placeholder) */}
      <div className="bg-green-100 rounded p-4 mt-4 text-green-800">
        Timeline visual de eventos por parcela
      </div>
    </main>
  );
};

export default EventsPage; 