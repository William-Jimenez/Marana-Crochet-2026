import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Upload,
  CheckCircle,
  AlertTriangle,
  Building,
  Smartphone,
  Image as ImageIcon,
} from 'lucide-react';
import { MARANA_ASSETS } from '../data/mockData';

export const PaymentProofModal: React.FC = () => {
  const {
    selectedOrderForProof,
    setSelectedOrderForProof,
    submitPaymentProof,
  } = useApp();

  const [bankName, setBankName] = useState('Nequi');
  const [receiptNumber, setReceiptNumber] = useState('NEQ-928471');
  const [proofImage, setProofImage] = useState<string>(MARANA_ASSETS.hero);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedOrderForProof) return null;

  const order = selectedOrderForProof;
  const isResubmission = order.paymentStatus === 'rejected';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName || !receiptNumber) return;

    setIsSubmitting(true);
    submitPaymentProof(order.id, {
      bankName,
      receiptNumber,
      imageUrl: proofImage,
    });
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h3 className="font-display text-base sm:text-lg font-bold text-stone-900">
              {isResubmission ? 'Reenviar Comprobante de Pago' : 'Reportar Comprobante de Pago'}
            </h3>
            <p className="text-xs text-stone-500">
              Pedido <strong className="text-stone-800">{order.id}</strong> · Total: $
              {order.total.toLocaleString('es-CO')} COP
            </p>
          </div>
          <button
            onClick={() => setSelectedOrderForProof(null)}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If this is resubmission because of rejection, display admin reason */}
        {isResubmission && order.paymentProof?.rejectedReason && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-rose-900">Motivo del rechazo anterior:</span>
              <p className="text-rose-800 mt-0.5">{order.paymentProof.rejectedReason}</p>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Bank selector */}
          <div>
            <label className="block font-medium text-stone-700 mb-1">
              Entidad Financiera o Medio de Pago *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Nequi', 'Bancolombia', 'Daviplata'].map((bank) => (
                <button
                  type="button"
                  key={bank}
                  onClick={() => setBankName(bank)}
                  className={`py-2 px-3 rounded-lg border font-medium text-xs transition ${
                    bankName === bank
                      ? 'border-purple-800 bg-purple-50 text-purple-900 font-bold'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {bank}
                </button>
              ))}
            </div>
          </div>

          {/* Reference / Approval Code */}
          <div>
            <label className="block font-medium text-stone-700 mb-1">
              Número de Aprobación o Referencia de Transacción *
            </label>
            <input
              type="text"
              required
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value)}
              placeholder="Ej: M1829374 ó 092837"
              className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-purple-700 focus:outline-none font-mono"
            />
          </div>

          {/* Image Upload & Preview */}
          <div>
            <label className="block font-medium text-stone-700 mb-1">
              Captura o Foto del Comprobante *
            </label>

            <div className="space-y-3">
              {proofImage && (
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                  <img
                    src={proofImage}
                    alt="Preview Comprobante"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-stone-900/70 text-white text-[10px] px-2 py-0.5 rounded">
                    Vista previa comprobante
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <label className="flex-1 py-2 px-3 border border-dashed border-purple-400 bg-purple-50/50 hover:bg-purple-100/50 rounded-lg cursor-pointer text-center text-purple-900 font-semibold transition flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4 text-purple-700" />
                  <span>Subir archivo desde tu dispositivo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-4 flex items-center justify-end gap-2 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setSelectedOrderForProof(null)}
              className="px-4 py-2 font-semibold text-stone-600 hover:text-stone-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-purple-900 hover:bg-purple-800 text-white rounded-xl font-semibold flex items-center gap-2 transition shadow-xs"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Enviar para Verificación</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
