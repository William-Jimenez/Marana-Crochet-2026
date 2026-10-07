import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Heart, Plus, Star, Check, AlertCircle, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, quickViewProduct, favorites, toggleFavorite } = useApp();
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const isFav = favorites.includes(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= product.minStockAlert;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;

    setIsAdding(true);
    const result = addToCart(product, 1);
    setIsAdding(false);

    if (result.success) {
      setFeedbackMsg('¡Agregado!');
      setTimeout(() => setFeedbackMsg(null), 1800);
    } else {
      setFeedbackMsg(result.message || 'Sin stock');
      setTimeout(() => setFeedbackMsg(null), 2500);
    }
  };

  const getCategoryLabel = (cat: Product['category']) => {
    switch (cat) {
      case 'amigurumis':
        return 'Amigurumi';
      case 'prendas':
        return 'Prenda';
      case 'accesorios':
        return 'Accesorio';
      case 'kits_patrones':
        return 'Kit & Patrón';
    }
  };

  return (
    <article
      onClick={() => quickViewProduct(product)}
      className="group relative bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Visual Image Container - 65%-70% of card visual weight */}
      <div className="relative aspect-[4/3] w-full bg-[#F5F2EB] overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors shadow-xs ${
            isFav
              ? 'bg-purple-900 text-purple-200'
              : 'bg-white/80 text-stone-600 hover:text-purple-800 hover:bg-white'
          }`}
          title={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-purple-300' : ''}`} />
        </button>

        {/* Quick View Button overlay on hover */}
        <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-stone-900 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5 backdrop-blur-xs">
            <Eye className="w-3.5 h-3.5" /> Ver Detalle
          </span>
        </div>
      </div>

      {/* Card Content & Metadata - Clean unboxed text with typographic separators */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Metadata: Category and Rating (No pills!) */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-purple-800 text-[11px]">
              {getCategoryLabel(product.category)}
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="flex items-center gap-1 text-stone-600">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-stone-400">({product.reviewCount})</span>
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-base font-semibold text-stone-900 group-hover:text-purple-900 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Short description preview */}
          <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Bottom Price & Purchase Action */}
        <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-stone-900 font-mono tabular-nums tracking-tight">
                ${product.price.toLocaleString('es-CO')}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-stone-400 line-through font-mono tabular-nums">
                  ${product.originalPrice.toLocaleString('es-CO')}
                </span>
              )}
            </div>

            {/* Stock indicator text */}
            <div className="text-[11px] mt-0.5">
              {isOutOfStock ? (
                <span className="text-rose-600 font-semibold">Agotado</span>
              ) : isLowStock ? (
                <span className="text-amber-700 font-medium">¡Últimas {product.stock} unidades!</span>
              ) : (
                <span className="text-emerald-700">En stock ({product.stock} disp.)</span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="relative">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding}
              className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition shadow-xs whitespace-nowrap ${
                isOutOfStock
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                  : 'bg-purple-900 text-white hover:bg-purple-800 active:scale-95'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isOutOfStock ? 'Sin Stock' : 'Agregar'}</span>
            </button>

            {/* Inline feedback toast message */}
            {feedbackMsg && (
              <div className="absolute right-0 bottom-full mb-1 z-20 bg-stone-900 text-white text-[11px] font-medium py-1 px-2.5 rounded shadow-lg whitespace-nowrap animate-in fade-in slide-in-from-bottom-1 flex items-center gap-1">
                {feedbackMsg.includes('Solo') || feedbackMsg.includes('Sin') ? (
                  <AlertCircle className="w-3 h-3 text-amber-400" />
                ) : (
                  <Check className="w-3 h-3 text-emerald-400" />
                )}
                {feedbackMsg}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
