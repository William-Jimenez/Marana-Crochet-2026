import React from 'react';
import { useApp } from '../context/AppContext';
import { CustomQuoteRequest } from '../types';
import {
  Sparkles,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Plus,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export const CustomQuotesView: React.FC = () => {
  const {
    quotes,
    customerAcceptQuote,
    setIsQuoteModalOpen,
    currentUser,
  } = useApp();

  const customerQuotes = quotes.filter(
    (q) => !currentUser || q.userId === currentUser.id || q.userId === 'usr-customer-1'
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5 mb-8">
        <div>
          <h2 className="font-display text-2xl font-bold text-stone-900">
            Mis Solicitudes de Pedidos a Medida (HU-35)
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Bifurcación de cotizaciones para piezas exclusivas y réplicas en crochet.
          </p>
        </div>

        <button
          onClick={() => setIsQuoteModalOpen(true)}
          className="px-4 py-2.5 bg-purple-900 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Solicitar Nueva Cotización</span>
        </button>
      </div>

      {customerQuotes.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center space-y-4 max-w-md mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="font-display text-lg font-bold text-stone-900">
            No tienes cotizaciones activas
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            ¿Sueñas con un amigurumi de tu mascota o una chaqueta en crochet con tus medidas? Cuéntanos tu idea.
          </p>
          <button
            onClick={() => setIsQuoteModalOpen(true)}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-purple-900 hover:bg-purple-800 rounded-xl transition shadow-xs"
          >
            Solicitar Mi Primera Cotización
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {customerQuotes.map((quote) => {
            const isQuoted = quote.status === 'quoted';
            const isAccepted = quote.status === 'accepted';
            const isRejected = quote.status === 'rejected';

            return (
              <div
                key={quote.id}
                className="bg-white border border-stone-200 rounded-2xl shadow-xs overflow-hidden"
              >
                {/* Quote Header */}
                <div className="p-4 sm:p-5 bg-stone-50/80 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-mono text-stone-400 text-[11px] block">
                      SOLICITUD {quote.id} · {new Date(quote.createdAt).toLocaleDateString('es-CO')}
                    </span>
                    <h3 className="font-bold text-stone-900 text-sm mt-0.5">{quote.itemType}</h3>
                  </div>

                  {/* Status */}
                  <div>
                    {quote.status === 'pending' && (
                      <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-md font-semibold text-xs flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>En Revisión por el Taller</span>
                      </span>
                    )}
                    {isQuoted && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-900 border border-purple-200 rounded-md font-bold text-xs flex items-center gap-1.5 animate-pulse">
                        <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                        <span>¡Cotización Lista para Aceptar!</span>
                      </span>
                    )}
                    {isAccepted && (
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md font-semibold text-xs flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Aceptada · Pedido Generado</span>
                      </span>
                    )}
                    {isRejected && (
                      <span className="px-3 py-1 bg-rose-50 text-rose-800 border border-rose-200 rounded-md font-semibold text-xs flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>No Disponible / Rechazada</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3 text-xs">
                  <div>
                    <span className="font-semibold text-stone-700 block mb-1">
                      Descripción de la pieza solicitada:
                    </span>
                    <p className="text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100 leading-relaxed">
                      {quote.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-stone-600">
                    <div>
                      <span className="font-medium text-stone-500">Medidas indicadas: </span>
                      <strong className="text-stone-800">{quote.dimensions}</strong>
                    </div>
                    <div>
                      <span className="font-medium text-stone-500">Colores preferidos: </span>
                      <strong className="text-stone-800">{quote.preferredColors}</strong>
                    </div>
                  </div>

                  {/* Quoted Box when Admin has provided Price and Time */}
                  {isQuoted && (
                    <div className="mt-4 p-4 bg-purple-50 border-2 border-purple-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900 block">
                          Propuesta de Maraña Crochet
                        </span>
                        <div className="text-xl font-bold font-mono text-purple-950 mt-0.5 tabular-nums">
                          ${quote.quotedPrice?.toLocaleString('es-CO')} COP
                        </div>
                        <div className="flex items-center gap-2 text-stone-600 mt-1">
                          <Calendar className="w-3.5 h-3.5 text-purple-700" />
                          <span>Tiempo estimado de tejido: {quote.estimatedDays} días hábiles</span>
                        </div>
                        {quote.adminNote && (
                          <p className="text-[11px] text-stone-500 italic mt-1">
                            Nota del taller: "{quote.adminNote}"
                          </p>
                        )}
                      </div>

                      {/* Happy Path Step 7 Conversion: Accept Quote and pay */}
                      <button
                        onClick={() => customerAcceptQuote(quote.id)}
                        className="px-5 py-3 bg-purple-900 hover:bg-purple-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition whitespace-nowrap"
                      >
                        <span>Aceptar Cotización y Pagar Anticipo</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Rejected note */}
                  {isRejected && quote.adminNote && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800">
                      <strong>Motivo del taller:</strong> {quote.adminNote}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
