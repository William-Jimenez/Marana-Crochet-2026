import React from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  Copy,
  Upload,
  ArrowRight,
  ShoppingBag,
  Building,
  Smartphone,
} from 'lucide-react';

export const OrderSuccessModal: React.FC = () => {
  const {
    checkoutSuccessOrder,
    setCheckoutSuccessOrder,
    setSelectedOrderForProof,
    setActiveTab,
  } = useApp();

  if (!checkoutSuccessOrder) return null;

  const handleAttachProof = () => {
    const order = checkoutSuccessOrder;
    setCheckoutSuccessOrder(null);
    setSelectedOrderForProof(order);
  };

  const handleKeepBrowsing = () => {
    setCheckoutSuccessOrder(null);
    setActiveTab('catalog');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 p-6 sm:p-8 text-center space-y-5">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        {/* Title & Order ID */}
        <div>
          <span className="text-xs font-semibold text-purple-700 tracking-wider uppercase">
            Paso 6 Completado · Inventario Reservado
          </span>
          <h3 className="font-display text-2xl font-bold text-stone-900 mt-1">
            ¡Tu pedido ha sido confirmado!
          </h3>
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-stone-100 rounded-lg text-xs font-mono font-bold text-stone-800">
            <span>Pedido {checkoutSuccessOrder.id}</span>
          </div>
        </div>

        {/* Summary note */}
        <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
          Hemos reservado tus piezas de crochet y descontado el inventario. Tu pedido se encuentra en estado{' '}
          <strong className="text-stone-900">"Pendiente de verificación de pago"</strong>.
        </p>

        {/* Bank details card for manual transfer */}
        {checkoutSuccessOrder.paymentMethod === 'transfer' && (
          <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4 text-left text-xs space-y-2">
            <span className="font-semibold text-purple-950 block">
              Cuentas para transferir (${checkoutSuccessOrder.total.toLocaleString('es-CO')} COP):
            </span>
            <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-purple-100">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-purple-700" />
                <span>
                  <strong>Nequi / Daviplata:</strong> 315 889 4421
                </span>
              </div>
              <span className="text-[10px] text-stone-400">Maraña Crochet</span>
            </div>
            <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-purple-100">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-purple-700" />
                <span>
                  <strong>Bancolombia Ahorros:</strong> 450-992182-10
                </span>
              </div>
              <span className="text-[10px] text-stone-400">Valentina M.</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          {checkoutSuccessOrder.paymentMethod === 'transfer' && (
            <button
              onClick={handleAttachProof}
              className="w-full py-3 px-4 bg-purple-900 hover:bg-purple-800 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-sm"
            >
              <Upload className="w-4 h-4" />
              <span>Reportar Comprobante de Pago Ahora</span>
            </button>
          )}

          <button
            onClick={handleKeepBrowsing}
            className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Seguir Explorando el Catálogo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
