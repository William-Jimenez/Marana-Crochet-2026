import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';

export const CustomerFavoritesView: React.FC = () => {
  const { products, favorites, setActiveTab } = useApp();

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      <div className="border-b border-stone-200 pb-5 mb-8 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-stone-900">
            Mis Favoritos (HU-21)
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Piezas de crochet guardadas para tu próxima compra o inspiración.
          </p>
        </div>
        <span className="text-xs font-semibold text-purple-900 bg-purple-100 px-3 py-1 rounded-full">
          {favoriteProducts.length} Guardados
        </span>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center space-y-4 max-w-md mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-display text-lg font-bold text-stone-900">
            Aún no has guardado favoritos
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Haz clic en el corazón de cualquier amigurumi o prenda tejida para tenerlo a la mano.
          </p>
          <button
            onClick={() => setActiveTab('catalog')}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-purple-900 hover:bg-purple-800 rounded-xl transition shadow-xs"
          >
            Explorar Catálogo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
