import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Star, Heart, Sparkles, Send } from 'lucide-react';

export const ReviewModal: React.FC = () => {
  const {
    selectedOrderForReview,
    setSelectedOrderForReview,
    submitReview,
  } = useApp();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedOrderForReview) return null;

  const order = selectedOrderForReview;
  const primaryItem = order.items[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !primaryItem) return;

    setIsSubmitting(true);
    submitReview(primaryItem.productId, order.id, rating, comment);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h3 className="font-display text-base sm:text-lg font-bold text-stone-900">
              Califica tu Creación Artesanal
            </h3>
            <p className="text-xs text-stone-500">
              Pedido <strong className="text-stone-800">{order.id}</strong>
            </p>
          </div>
          <button
            onClick={() => setSelectedOrderForReview(null)}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item preview */}
        {primaryItem && (
          <div className="p-4 bg-purple-50/50 border-b border-purple-100 flex items-center gap-3">
            <img
              src={primaryItem.imageUrl}
              alt={primaryItem.name}
              className="w-12 h-12 rounded-lg object-cover border border-purple-200"
            />
            <div>
              <h4 className="text-xs font-bold text-stone-900">{primaryItem.name}</h4>
              <p className="text-[11px] text-stone-500">Tejido a mano con amor por Maraña</p>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Star selector */}
          <div className="text-center space-y-2">
            <label className="block font-medium text-stone-700">
              ¿Qué tal te pareció la calidad del tejido y acabado?
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= (hoverRating || rating)
                        ? 'text-amber-500 fill-amber-500'
                        : 'text-stone-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-[11px] font-semibold text-purple-900">
              {rating === 5
                ? '¡Excelente! Obra de arte artesanal'
                : rating === 4
                ? 'Muy bonito y suave'
                : rating === 3
                ? 'Bueno'
                : 'Regular'}
            </span>
          </div>

          {/* Comment text */}
          <div>
            <label className="block font-medium text-stone-700 mb-1">
              Tu experiencia o comentario para la comunidad *
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Cuéntanos sobre la textura, los detalles bordados, el empaque..."
              className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-purple-700 focus:outline-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setSelectedOrderForReview(null)}
              className="px-4 py-2 font-semibold text-stone-600 hover:text-stone-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="px-5 py-2.5 bg-purple-900 hover:bg-purple-800 disabled:opacity-50 text-white rounded-xl font-semibold flex items-center gap-2 transition shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>Publicar Reseña</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
