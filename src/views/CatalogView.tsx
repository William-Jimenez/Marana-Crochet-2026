import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { ProductCategory } from '../types';
import { MARANA_ASSETS } from '../data/mockData';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  Scissors,
  HeartHandshake,
  Clock,
  RotateCcw,
  PackageOpen,
} from 'lucide-react';

export const CatalogView: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    onlyInStock,
    setOnlyInStock,
    setIsQuoteModalOpen,
    role,
    setIsAuthModalOpen,
  } = useApp();

  const [isLoading, setIsLoading] = useState(false);

  // Simulate skeleton screen smoothly when filters change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery, onlyInStock]);

  const categories: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'amigurumis', label: 'Amigurumis' },
    { id: 'prendas', label: 'Prendas Tejidas' },
    { id: 'accesorios', label: 'Bolsos & Accesorios' },
    { id: 'kits_patrones', label: 'Kits & Patrones' },
  ];

  // Filtering products
  const filteredProducts = products.filter((prod) => {
    const matchesCategory =
      selectedCategory === 'all' || prod.category === selectedCategory;

    const matchesSearch =
      searchQuery.trim() === '' ||
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStock = !onlyInStock || prod.stock > 0;

    return matchesCategory && matchesSearch && matchesStock;
  });

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setOnlyInStock(false);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Showcase Section - Artisanal campaign focal point */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F3EBF9] via-[#FAF5FF] to-[#FAF8F5] border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-purple-700" />
              <span>Colección Hecha a Mano 2026</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-purple-950 tracking-tight leading-[1.15]">
              Ternura tejida a mano, <br />
              <span className="text-purple-700">punto a punto con amor.</span>
            </h1>

            <p className="text-sm sm:text-base text-stone-600 max-w-xl leading-relaxed">
              En Maraña transformamos hilos de algodón en amigurumis únicos, prendas acogedoras y accesorios artesanales. Sin intermediarios, con verificación directa y dedicación en cada detalle.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#catalogo-grid"
                className="px-5 py-3 bg-purple-900 hover:bg-purple-800 text-white rounded-xl font-semibold text-xs sm:text-sm transition shadow-sm"
              >
                Explorar Catálogo ({products.length} Creaciones)
              </a>

              <button
                onClick={() => {
                  if (role === 'visitor') setIsAuthModalOpen(true);
                  else setIsQuoteModalOpen(true);
                }}
                className="px-5 py-3 bg-white hover:bg-purple-50 text-purple-950 border border-purple-200 rounded-xl font-semibold text-xs sm:text-sm transition flex items-center gap-2 shadow-xs"
              >
                <Scissors className="w-4 h-4 text-purple-700" />
                <span>Pedir Diseño Personalizado</span>
              </button>
            </div>

            {/* Quality pill-free trust indicators */}
            <div className="pt-4 flex items-center gap-6 text-xs text-stone-500">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-purple-700" />
                <span>100% Algodón hipoalergénico</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-700" />
                <span>Envíos a todo el país</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Image Card with Mascot Emblem */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-purple-100">
              <img
                src={MARANA_ASSETS.hero}
                alt="Taller Maraña Crochet"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-950/60 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-purple-200">
                    Taller Creativo Medellín
                  </span>
                  <h3 className="font-display text-lg font-bold">
                    Artesanía Colombiana de Vanguardia
                  </h3>
                </div>
              </div>
            </div>

            {/* Floating cute mascot badge */}
            <div className="absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-5 bg-white p-2 rounded-2xl shadow-xl border border-purple-100 flex items-center gap-3 animate-bounce-slow">
              <img
                src={MARANA_ASSETS.logo}
                alt="Maraña"
                className="w-12 h-12 rounded-xl object-cover border border-purple-200"
              />
              <div className="pr-2">
                <span className="text-xs font-bold text-stone-900 block">Maraña Original</span>
                <span className="text-[10px] text-purple-700 font-medium">Diseños con alma</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog & Filter Bar (HU-04, HU-08, HU-09) */}
      <section id="catalogo-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <h2 className="font-display text-2xl font-bold text-stone-900">
              Catálogo de Productos
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Explora libremente nuestras creaciones artesanales listas para ordenar.
            </p>
          </div>

          {/* Search bar (HU-08) */}
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar amigurumis, prendas..."
                className="w-full pl-9 pr-4 py-2 bg-white text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-700"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-stone-400 hover:text-stone-700 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Segmented Filters & Stock Switcher */}
        <div className="py-5 flex flex-wrap items-center justify-between gap-4">
          {/* Segmented Category Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-200/70 rounded-xl">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-white text-purple-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* In Stock Only Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-stone-700 bg-white px-3 py-1.5 rounded-lg border border-stone-200 shadow-2xs">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="accent-purple-700 rounded"
            />
            <span className="font-medium">Ocultar productos agotados</span>
          </label>
        </div>

        {/* Product Grid / Skeleton / Empty States (Fase 4: UI States) */}
        {isLoading ? (
          // Skeleton Screens (Estructuras grises parpadeantes)
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {[1, 2, 3, 4, 5, 6].map((sk) => (
              <div
                key={sk}
                className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs animate-pulse"
              >
                <div className="aspect-[4/3] bg-stone-200" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-stone-200 rounded w-1/3" />
                  <div className="h-5 bg-stone-200 rounded w-3/4" />
                  <div className="h-3 bg-stone-100 rounded w-full" />
                  <div className="pt-4 flex justify-between items-center">
                    <div className="h-5 bg-stone-200 rounded w-1/4" />
                    <div className="h-8 bg-stone-200 rounded w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          // Empty State (Fase 4: Ninguna pantalla en blanco)
          <div className="my-12 py-16 px-6 bg-white border border-stone-200 rounded-2xl text-center space-y-4 max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
              <PackageOpen className="w-8 h-8" />
            </div>
            <h3 className="font-display text-lg font-bold text-stone-900">
              No encontramos productos con esos filtros
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed max-w-sm mx-auto">
              Prueba cambiando la búsqueda o restableciendo la categoría seleccionada para volver a ver todas nuestras piezas artesanales.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-xs font-semibold text-purple-900 bg-purple-100 hover:bg-purple-200 rounded-xl transition inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar filtros y ver todo</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-2">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Custom Order Callout Section (HU-35 Bifurcación) */}
        <div className="mt-16 bg-gradient-to-r from-purple-900 to-indigo-950 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-lg">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider inline-block">
              HU-35 · Hecho a Medida
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold leading-tight">
              ¿No encuentras exactamente lo que soñabas?
            </h3>
            <p className="text-xs sm:text-sm text-purple-200 leading-relaxed">
              Tejemos proyectos especiales: réplicas de tus mascotas en amigurumi, prendas con tus medidas corporales exactas y combinaciones de colores personalizadas.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  if (role === 'visitor') setIsAuthModalOpen(true);
                  else setIsQuoteModalOpen(true);
                }}
                className="px-5 py-2.5 bg-white text-purple-950 hover:bg-purple-50 font-bold text-xs sm:text-sm rounded-xl transition shadow-md inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-purple-700" />
                <span>Solicitar Cotización sin Costo</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
