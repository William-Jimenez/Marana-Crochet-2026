import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Sparkles,
  Send,
  Upload,
  Info,
  CheckCircle,
} from 'lucide-react';
import { MARANA_ASSETS } from '../data/mockData';

export const CustomQuoteModal: React.FC = () => {
  const {
    isQuoteModalOpen,
    setIsQuoteModalOpen,
    createQuoteRequest,
    currentUser,
  } = useApp();

  const [customerName, setCustomerName] = useState(currentUser?.name || 'Sofía Rodríguez');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || 'sofia.crochet@gmail.com');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '+57 315 889 4421');
  const [itemType, setItemType] = useState('Amigurumi de Mascota Personalizado');
  const [description, setDescription] = useState('');
  const [dimensions, setDimensions] = useState('Aproximadamente 20 cm');
  const [preferredColors, setPreferredColors] = useState('Lila pastel, crema y gris');
  const [referenceImage, setReferenceImage] = useState<string>(MARANA_ASSETS.spider);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isQuoteModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    createQuoteRequest({
      customerName,
      customerEmail,
      customerPhone,
      itemType,
      description,
      dimensions,
      preferredColors,
      referenceImage,
    });
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-700" />
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-stone-900">
                Cotización de Pedido Personalizado
              </h3>
              <p className="text-xs text-stone-500">
                HU-35: Cuéntanos tu idea y Valentina calculará el costo y tiempo de tejido
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsQuoteModalOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info banner */}
        <div className="bg-purple-50/60 p-3 mx-6 mt-4 rounded-xl text-xs text-purple-900 border border-purple-200 flex items-start gap-2">
          <Info className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Las piezas personalizadas se tejen exclusivamente bajo pedido. La cotización es gratuita y sin compromiso. Una vez aprobada por ti, requerirá el 50% de anticipo para iniciar el tejido.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-stone-700 mb-1">Nombre Completo *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-purple-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">WhatsApp / Contacto *</label>
              <input
                type="text"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-purple-700 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">Tipo de Proyecto *</label>
            <select
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
              className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-purple-700 focus:outline-none bg-white font-medium"
            >
              <option value="Amigurumi de Mascota Personalizado">Amigurumi de Mascota Personalizado</option>
              <option value="Personaje de Serie o Anime en Crochet">Personaje de Serie o Anime en Crochet</option>
              <option value="Prenda de Vestir a Medida (Top / Cardigan / Suéter)">Prenda de Vestir a Medida (Top / Cardigan / Suéter)</option>
              <option value="Accesorio / Bolso Especial">Accesorio / Bolso Especial</option>
              <option value="Manta / Pieza Decorativa">Manta / Pieza Decorativa</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">
              Descripción Detallada de la Idea *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe rasgos, detalles específicos, si lleva accesorios adicionales (ej. collar, gorrito)..."
              className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-purple-700 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-stone-700 mb-1">Medidas Estimadas</label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="Ej: 20 cm de alto / Talla M"
                className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-purple-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">Colores Preferidos</label>
              <input
                type="text"
                value={preferredColors}
                onChange={(e) => setPreferredColors(e.target.value)}
                placeholder="Ej: Lila, blanco hueso y toques dorados"
                className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-purple-700 focus:outline-none"
              />
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setIsQuoteModalOpen(false)}
              className="px-4 py-2 font-semibold text-stone-600 hover:text-stone-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !description.trim()}
              className="px-5 py-2.5 bg-purple-900 hover:bg-purple-800 disabled:opacity-50 text-white rounded-xl font-semibold flex items-center gap-2 transition shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Solicitud de Cotización</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
