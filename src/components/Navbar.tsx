import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  Heart,
  Sparkles,
  User,
  ShieldAlert,
  Bell,
  Package,
  GraduationCap,
  FileQuestion,
  ChevronDown,
  X,
  Check,
} from 'lucide-react';
import { MARANA_ASSETS } from '../data/mockData';

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    currentUser,
    activeTab,
    setActiveTab,
    cart,
    setIsCartOpen,
    favorites,
    notifications,
    markNotificationAsRead,
    clearNotifications,
    setIsAuthModalOpen,
    setIsQuoteModalOpen,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const unreadNotifs = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      {/* Top Banner Notice for Role switching awareness */}
      <div className="bg-purple-900 text-purple-100 text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>
            Simulador de Roles RBAC: Estás navegando como{' '}
            <strong className="text-white font-semibold capitalize">
              {role === 'visitor' ? 'Visitante (Anónimo)' : role === 'customer' ? 'Cliente (Sofía R.)' : 'Administrador (Taller Maraña)'}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-purple-300 hidden sm:inline">Cambiar rol rápido:</span>
          <button
            onClick={() => setRole('visitor')}
            className={`px-2 py-0.5 rounded transition ${
              role === 'visitor' ? 'bg-purple-700 text-white font-bold' : 'text-purple-200 hover:bg-purple-800'
            }`}
          >
            Visitante
          </button>
          <span className="text-purple-400">/</span>
          <button
            onClick={() => setRole('customer')}
            className={`px-2 py-0.5 rounded transition ${
              role === 'customer' ? 'bg-purple-700 text-white font-bold' : 'text-purple-200 hover:bg-purple-800'
            }`}
          >
            Cliente
          </button>
          <span className="text-purple-400">/</span>
          <button
            onClick={() => setRole('admin')}
            className={`px-2 py-0.5 rounded transition ${
              role === 'admin' ? 'bg-purple-700 text-white font-bold' : 'text-purple-200 hover:bg-purple-800'
            }`}
          >
            Admin
          </button>
        </div>
      </div>

      {/* Main Navigation Bar - Following Top Bar Contract (3 Zones) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark & Mascot Logo */}
        <div
          onClick={() => setActiveTab(role === 'admin' ? 'admin' : 'catalog')}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-purple-400 shadow-sm bg-purple-100 group-hover:scale-105 transition-transform">
            <img
              src={MARANA_ASSETS.logo}
              alt="Maraña Mascot"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <span className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-purple-950 flex items-center gap-1.5">
              MARAÑA
              <span className="text-purple-600 font-sans text-xs uppercase tracking-widest font-semibold px-1.5 py-0.5 bg-purple-100 rounded">
                Crochet
              </span>
            </span>
            <p className="text-[10px] text-stone-500 font-medium tracking-wide">
              Tejido Artesanal Colombiano
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Clean text links with subtle hover underlines) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-stone-700">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`transition-colors py-1 relative ${
              activeTab === 'catalog' ? 'text-purple-900 font-semibold' : 'hover:text-purple-800'
            }`}
          >
            Catálogo
            {activeTab === 'catalog' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
            )}
          </button>

          {role !== 'admin' && (
            <>
              <button
                onClick={() => {
                  if (role === 'visitor') {
                    setIsAuthModalOpen(true);
                  } else {
                    setActiveTab('orders');
                  }
                }}
                className={`transition-colors py-1 relative ${
                  activeTab === 'orders' ? 'text-purple-900 font-semibold' : 'hover:text-purple-800'
                }`}
              >
                Mis Pedidos
                {activeTab === 'orders' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
                )}
              </button>

              <button
                onClick={() => {
                  if (role === 'visitor') {
                    setIsAuthModalOpen(true);
                  } else {
                    setActiveTab('quotes');
                  }
                }}
                className={`transition-colors py-1 relative ${
                  activeTab === 'quotes' ? 'text-purple-900 font-semibold' : 'hover:text-purple-800'
                }`}
              >
                Pedidos a Medida
                {activeTab === 'quotes' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('classes')}
                className={`transition-colors py-1 relative ${
                  activeTab === 'classes' ? 'text-purple-900 font-semibold' : 'hover:text-purple-800'
                }`}
              >
                Clases Virtuales
                {activeTab === 'classes' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('favorites')}
                className={`transition-colors py-1 relative ${
                  activeTab === 'favorites' ? 'text-purple-900 font-semibold' : 'hover:text-purple-800'
                }`}
              >
                Favoritos ({favorites.length})
                {activeTab === 'favorites' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
                )}
              </button>
            </>
          )}

          {role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`transition-colors py-1 relative text-purple-900 font-semibold flex items-center gap-1.5`}
            >
              <ShieldAlert className="w-4 h-4 text-purple-600" />
              Panel Administrador
              {activeTab === 'admin' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
              )}
            </button>
          )}
        </nav>

        {/* Zone 3: Primary Actions (Custom Quote CTA + Notifications + Cart + Auth) */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Custom Quote Request CTA */}
          {role !== 'admin' && (
            <button
              onClick={() => {
                if (role === 'visitor') {
                  setIsAuthModalOpen(true);
                } else {
                  setIsQuoteModalOpen(true);
                }
              }}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-900 bg-purple-100/90 border border-purple-200/80 rounded-lg hover:bg-purple-200/90 transition shadow-xs whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Cotizar Personalizado
            </button>
          )}

          {/* Notifications dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 text-stone-600 hover:text-purple-900 hover:bg-stone-100 rounded-full transition relative"
              title="Notificaciones"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifs > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-purple-600 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-stone-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="font-semibold text-xs text-stone-900">Notificaciones</span>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-[11px] text-stone-500 hover:text-stone-800"
                    >
                      Limpiar todas
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-stone-100 py-1">
                  {notifications.length === 0 ? (
                    <p className="text-center text-xs text-stone-400 py-6">
                      No tienes notificaciones pendientes.
                    </p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`py-2 px-1 text-xs cursor-pointer hover:bg-purple-50/50 rounded transition ${
                          !n.isRead ? 'font-medium bg-purple-50/30' : 'text-stone-600'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-1">
                          <span className="text-purple-900 font-semibold">{n.title}</span>
                          <span className="text-[10px] text-stone-400">{n.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Shopping Cart Drawer Trigger */}
          {role !== 'admin' && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-stone-700 hover:text-purple-900 hover:bg-purple-50 rounded-full transition flex items-center gap-1.5"
              aria-label="Carrito de Compras"
            >
              <ShoppingBag className="w-5 h-5 text-purple-900" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-purple-700 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {cartItemsCount}
                </span>
              )}
            </button>
          )}

          {/* User Account / Auth Button */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-1 border-l border-stone-200">
              <button
                onClick={() => {
                  if (role === 'admin') setActiveTab('admin');
                  else setActiveTab('orders');
                }}
                className="flex items-center gap-2 text-xs font-medium text-stone-800 hover:text-purple-900 py-1 px-2 rounded-lg hover:bg-stone-100 transition"
              >
                <div className="w-7 h-7 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">{currentUser.name}</span>
              </button>
              <button
                onClick={() => setRole('visitor')}
                className="text-stone-400 hover:text-stone-700 text-xs p-1"
                title="Cerrar sesión"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-purple-900 hover:bg-purple-800 rounded-lg transition shadow-xs whitespace-nowrap"
            >
              Ingresar
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="md:hidden flex items-center justify-around border-t border-stone-200/80 px-2 py-2 bg-[#FAF8F5] text-xs">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`py-1 px-2 rounded font-medium ${
            activeTab === 'catalog' ? 'text-purple-900 font-bold bg-purple-100' : 'text-stone-600'
          }`}
        >
          Catálogo
        </button>
        {role !== 'admin' ? (
          <>
            <button
              onClick={() => (role === 'visitor' ? setIsAuthModalOpen(true) : setActiveTab('orders'))}
              className={`py-1 px-2 rounded font-medium ${
                activeTab === 'orders' ? 'text-purple-900 font-bold bg-purple-100' : 'text-stone-600'
              }`}
            >
              Pedidos
            </button>
            <button
              onClick={() => (role === 'visitor' ? setIsAuthModalOpen(true) : setActiveTab('quotes'))}
              className={`py-1 px-2 rounded font-medium ${
                activeTab === 'quotes' ? 'text-purple-900 font-bold bg-purple-100' : 'text-stone-600'
              }`}
            >
              A Medida
            </button>
            <button
              onClick={() => setActiveTab('classes')}
              className={`py-1 px-2 rounded font-medium ${
                activeTab === 'classes' ? 'text-purple-900 font-bold bg-purple-100' : 'text-stone-600'
              }`}
            >
              Clases
            </button>
          </>
        ) : (
          <button
            onClick={() => setActiveTab('admin')}
            className="py-1 px-2 rounded font-bold text-purple-900 bg-purple-100"
          >
            Panel Admin
          </button>
        )}
      </div>
    </header>
  );
};
