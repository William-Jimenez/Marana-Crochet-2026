import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Star,
  Plus,
  Minus,
  Heart,
  Check,
  AlertCircle,
  Truck,
  ShieldCheck,
  Scissors,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    favorites,
    toggleFavorite,
    reviews,
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!selectedProduct) return null;

  const isFav = favorites.includes(selectedProduct.id);
  const isOutOfStock = selectedProduct.stock <= 0;
  const isLowStock = selectedProduct.stock > 0 && selectedProduct.stock <= selectedProduct.minStockAlert;

  const productReviews = reviews.filter(
    (r) => r.productId === selectedProduct.id && r.isApproved
  );

  const handleIncrement = () => {
    if (quantity < selectedProduct.stock) {
      setQuantity((q) => q + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const result = addToCart(selectedProduct, quantity);
    if (result.success) {
      setFeedbackMsg(`¡Agregaste ${quantity} unidad(es) a tu bolsa!`);
      setTimeout(() => setFeedbackMsg(null), 2500);
    } else {
      setFeedbackMsg(result.message || 'Cantidad no disponible');
      setTimeout(() => setFeedbackMsg(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 text-stone-500 hover:text-stone-800 bg-white/80 hover:bg-white rounded-full shadow-xs transition"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          {/* Gallery / Image Slot Left */}
          <div className="bg-[#F6F4EE] p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200">
            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden shadow-xs bg-white">
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Artisanal authenticity trust badges */}
            <div className="mt-6 pt-6 border-t border-stone-200/80 space-y-3 text-xs text-stone-600">
              <div className="flex items-center gap-2.5">
                <Scissors className="w-4 h-4 text-purple-700 shrink-0" />
                <span>Tejido punto a punto 100% a mano con hilo hipoalergénico</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-purple-700 shrink-0" />
                <span>Envíos seguros a toda Colombia vía transportadora aliada</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0" />
                <span>Garantía de confección artesanal y revisión de calidad previa</span>
              </div>
            </div>
          </div>

          {/* Contiguous Purchase Module Right */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                <span className="font-semibold uppercase tracking-wider text-purple-800">
                  {selectedProduct.category}
                </span>
                <span className="font-mono text-stone-400">SKU: {selectedProduct.sku}</span>
              </div>

              {/* Title */}
              <h2 className="font-display text-2xl font-bold text-stone-900 leading-tight">
                {selectedProduct.name}
              </h2>

              {/* Rating and Reviews Counter */}
              <div className="flex items-center gap-2 mt-2 text-xs text-stone-600">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(selectedProduct.rating) ? 'fill-amber-500' : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-stone-900">{selectedProduct.rating.toFixed(1)}</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span>{selectedProduct.reviewCount} opiniones de compradores</span>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl font-bold text-stone-900 font-mono tabular-nums">
                  ${selectedProduct.price.toLocaleString('es-CO')} COP
                </span>
                {selectedProduct.originalPrice && (
                  <span className="text-sm text-stone-400 line-through font-mono tabular-nums">
                    ${selectedProduct.originalPrice.toLocaleString('es-CO')}
                  </span>
                )}
              </div>

              {/* Stock Status text */}
              <div className="mt-2 text-xs">
                {isOutOfStock ? (
                  <span className="text-rose-600 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Producto Agotado actualmente
                  </span>
                ) : isLowStock ? (
                  <span className="text-amber-700 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> ¡Solo quedan {selectedProduct.stock} unidades en el taller!
                  </span>
                ) : (
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> {selectedProduct.stock} unidades disponibles para despacho inmediato
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-4 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                {selectedProduct.description}
              </p>

              {/* Technical / Craft details */}
              {selectedProduct.details && selectedProduct.details.length > 0 && (
                <div className="mt-4 bg-stone-50 rounded-xl p-3 text-xs space-y-1.5 border border-stone-200/60">
                  <span className="font-semibold text-stone-800 block mb-1">
                    Ficha Técnica de Confección:
                  </span>
                  {selectedProduct.details.map((detail, idx) => (
                    <li key={idx} className="list-none flex items-start gap-1.5 text-stone-600">
                      <span className="text-purple-600 font-bold">·</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </div>
              )}
            </div>

            {/* Purchase CTA and Quantity Controls */}
            <div className="mt-6 pt-5 border-t border-stone-200">
              {feedbackMsg && (
                <div
                  className={`mb-3 p-2.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
                    feedbackMsg.includes('¡Agregaste')
                      ? 'bg-purple-100 text-purple-900 border border-purple-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {feedbackMsg.includes('¡Agregaste') ? (
                    <Check className="w-4 h-4 text-purple-700" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-700" />
                  )}
                  <span>{feedbackMsg}</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50">
                  <button
                    onClick={handleDecrement}
                    disabled={isOutOfStock || quantity <= 1}
                    className="p-2 text-stone-600 hover:text-stone-900 disabled:opacity-40 transition"
                    aria-label="Disminuir cantidad"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 font-mono text-sm font-semibold text-stone-900 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    disabled={isOutOfStock || quantity >= selectedProduct.stock}
                    className="p-2 text-stone-600 hover:text-stone-900 disabled:opacity-40 transition"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart CTA */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-xs ${
                    isOutOfStock
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      : 'bg-purple-900 text-white hover:bg-purple-800 active:scale-98'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isOutOfStock ? 'Agotado Temporalmente' : 'Agregar a la Bolsa'}</span>
                </button>

                {/* Favorite button */}
                <button
                  onClick={() => toggleFavorite(selectedProduct.id)}
                  className={`p-3 rounded-xl border transition ${
                    isFav
                      ? 'border-purple-300 bg-purple-50 text-purple-900'
                      : 'border-stone-300 text-stone-600 hover:bg-stone-50'
                  }`}
                  title={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                >
                  <Heart className={`w-5 h-5 ${isFav ? 'fill-purple-600 text-purple-600' : ''}`} />
                </button>
              </div>

              {/* Customer Reviews Section */}
              {productReviews.length > 0 && (
                <div className="mt-6 pt-4 border-t border-stone-100">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                    Reseñas Recientes de Clientes
                  </h4>
                  <div className="space-y-2">
                    {productReviews.map((rev) => (
                      <div key={rev.id} className="p-2.5 bg-stone-50 rounded-lg text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-stone-800">{rev.customerName}</span>
                          <span className="text-[10px] text-stone-400">{rev.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500 mb-1">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 fill-amber-500" />
                          ))}
                        </div>
                        <p className="text-stone-600 italic">"{rev.comment}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
