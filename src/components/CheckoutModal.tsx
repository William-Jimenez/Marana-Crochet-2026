import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentMethod } from '../types';
import {
  X,
  MapPin,
  Phone,
  CreditCard,
  Banknote,
  ArrowRight,
  ShieldCheck,
  Building,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    cart,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    appliedCoupon,
    createOrder,
  } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '+57 315 889 4421');
  const [address, setAddress] = useState(currentUser?.address || 'Carrera 43A # 18 Sur - 45');
  const [city, setCity] = useState(currentUser?.city || 'Medellín, Antioquia');
  const [notes, setNotes] = useState('Por favor empacar en caja de regalo ecológica.');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transfer');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const shippingCost = cartSubtotal > 120000 ? 0 : 8000;
  const grandTotal = cartTotal + shippingCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !address || !city) return;

    setIsSubmitting(true);
    const newOrder = createOrder({
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      shippingAddress: {
        address,
        city,
        notes,
      },
      paymentMethod,
    });
    setIsSubmitting(false);

    if (newOrder) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h3 className="font-display text-lg font-bold text-stone-900">
              Confirmación de Pedido y Envío
            </h3>
            <p className="text-xs text-stone-500">
              Paso 6: Registro de datos de entrega y selección de pago manual
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section 1: Customer & Shipping Information */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-700" />
              1. Datos de Entrega en Colombia
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-purple-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-purple-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Teléfono / WhatsApp *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-purple-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Ciudad y Departamento *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-purple-700 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-stone-700 mb-1">Dirección Exacta (Calle, Carrera, Apto, Barrio) *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-purple-700 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-stone-700 mb-1">Notas de Entrega / Indicaciones para el Mensajero (Opcional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Dejar en portería o timbre 201"
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-purple-700 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method Choice (Manual Verification) */}
          <div className="space-y-3 pt-3 border-t border-stone-200">
            <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-700" />
              2. Método de Pago Manual (Sin Pasarelas Externas)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Transfer */}
              <label
                onClick={() => setPaymentMethod('transfer')}
                className={`p-3.5 rounded-xl border-2 cursor-pointer flex flex-col justify-between transition ${
                  paymentMethod === 'transfer'
                    ? 'border-purple-800 bg-purple-50/50 text-stone-900'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-semibold text-xs">
                    <Building className="w-4 h-4 text-purple-700" />
                    <span>Transferencia Directa</span>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'transfer'}
                    onChange={() => setPaymentMethod('transfer')}
                    className="accent-purple-700"
                  />
                </div>
                <p className="text-[11px] text-stone-500 leading-snug">
                  Nequi, Bancolombia o Daviplata. Subes la foto del comprobante tras confirmar.
                </p>
              </label>

              {/* Option 2: Cash */}
              <label
                onClick={() => setPaymentMethod('cash')}
                className={`p-3.5 rounded-xl border-2 cursor-pointer flex flex-col justify-between transition ${
                  paymentMethod === 'cash'
                    ? 'border-purple-800 bg-purple-50/50 text-stone-900'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-semibold text-xs">
                    <Banknote className="w-4 h-4 text-emerald-700" />
                    <span>Efectivo Contraentrega</span>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                    className="accent-purple-700"
                  />
                </div>
                <p className="text-[11px] text-stone-500 leading-snug">
                  Pagas en efectivo al recibir en mano o al recoger en el taller de Medellín.
                </p>
              </label>
            </div>
          </div>

          {/* Section 3: Summary */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Artículos ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
              <span className="font-mono tabular-nums">${cartSubtotal.toLocaleString('es-CO')}</span>
            </div>
            {cartDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Descuento ({appliedCoupon?.code})</span>
                <span className="font-mono tabular-nums">-${cartDiscount.toLocaleString('es-CO')}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>Costo de Envío</span>
              <span className="font-mono tabular-nums">
                {shippingCost === 0 ? 'Gratis' : `$${shippingCost.toLocaleString('es-CO')}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
              <span>Total Final</span>
              <span className="font-mono tabular-nums text-purple-950">
                ${grandTotal.toLocaleString('es-CO')} COP
              </span>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
            >
              Regresar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-purple-900 hover:bg-purple-800 text-white rounded-xl font-semibold text-xs flex items-center gap-2 transition shadow-sm"
            >
              <span>Confirmar y Generar Pedido</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
