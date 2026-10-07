import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { MARANA_ASSETS } from '../data/mockData';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    loginAsCustomer,
    loginAsAdmin,
    role,
  } = useApp();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('sofia.crochet@gmail.com');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState('Sofía Rodríguez');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsCustomer();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="p-6 bg-[#FAF8F5] border-b border-stone-200 text-center relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-purple-500 mx-auto mb-2 shadow-sm bg-purple-100">
            <img
              src={MARANA_ASSETS.logo}
              alt="Maraña Crochet"
              className="w-full h-full object-cover"
            />
          </div>

          <h3 className="font-display text-xl font-bold text-purple-950">
            {isRegister ? 'Crear Cuenta en Maraña' : 'Iniciar Sesión'}
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            {isRegister
              ? 'Únete a nuestra comunidad artesanal para guardar pedidos y cursos'
              : 'Ingresa para gestionar tus pedidos artesanales y favoritos'}
          </p>
        </div>

        {/* 1-Click Fast Role Switcher Box for Instant Academic Evaluation */}
        <div className="p-5 bg-purple-50/70 border-b border-purple-200 space-y-2.5">
          <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wider block">
            Acceso Rápido para Pruebas (Evaluación SENA):
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={loginAsCustomer}
              className="p-2.5 bg-white border border-purple-200 hover:border-purple-500 hover:bg-purple-100/50 rounded-xl text-left transition shadow-xs group"
            >
              <div className="font-semibold text-xs text-purple-950 flex items-center justify-between">
                <span>Cliente Verificado</span>
                <ArrowRight className="w-3.5 h-3.5 text-purple-600 group-hover:translate-x-0.5 transition" />
              </div>
              <p className="text-[10px] text-stone-500 mt-0.5">Sofía R. (Compras y reseñas)</p>
            </button>

            <button
              onClick={loginAsAdmin}
              className="p-2.5 bg-white border border-purple-200 hover:border-purple-500 hover:bg-purple-100/50 rounded-xl text-left transition shadow-xs group"
            >
              <div className="font-semibold text-xs text-purple-950 flex items-center justify-between">
                <span>Administrador</span>
                <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
              </div>
              <p className="text-[10px] text-stone-500 mt-0.5">Control de pagos e inventario</p>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {isRegister && (
            <div>
              <label className="block font-medium text-stone-700 mb-1">Nombre Completo *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-purple-700 focus:outline-none"
                />
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>
          )}

          <div>
            <label className="block font-medium text-stone-700 mb-1">Correo Electrónico *</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-purple-700 focus:outline-none"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">Contraseña *</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-purple-700 focus:outline-none font-mono"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-purple-900 hover:bg-purple-800 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-xs mt-2"
          >
            <span>{isRegister ? 'Completar Registro' : 'Iniciar Sesión'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-stone-500 hover:text-purple-900 underline text-xs"
            >
              {isRegister
                ? '¿Ya tienes una cuenta? Inicia sesión aquí'
                : '¿No tienes cuenta aún? Regístrate en 30 segundos'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
