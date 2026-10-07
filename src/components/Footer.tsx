import React from 'react';
import { MARANA_ASSETS } from '../data/mockData';
import { Heart, Instagram, Sparkles, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Brand & Manifesto */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-purple-400 bg-purple-950">
                <img
                  src={MARANA_ASSETS.logo}
                  alt="Maraña Crochet"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-display text-xl font-bold tracking-tight text-white">
                  MARAÑA
                </span>
                <span className="text-purple-400 text-xs block font-mono">CROCHET ARTESANAL</span>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Cada creación es tejida a mano con hilos seleccionados de alta calidad, dedicando horas de concentración y cariño en cada lazada.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Medellín, Colombia · Envíos nacionales</span>
            </div>
          </div>

          {/* Categorías del Catálogo */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 tracking-wide">Colecciones</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>Amigurumis & Muñecos de Apego</li>
              <li>Prendas & Tops Granny Square</li>
              <li>Bolsos Tote & Accesorios</li>
              <li>Kits de Iniciación & Patrones</li>
              <li>Pedidos Personalizados a Medida</li>
            </ul>
          </div>

          {/* Formas de Pago y Garantía Artesanal */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 tracking-wide">Pagos & Envíos</h4>
            <div className="space-y-3 text-xs text-stone-400">
              <p className="leading-relaxed">
                Aceptamos transferencias manuales directas sin intermediarios:
              </p>
              <div className="flex flex-wrap gap-2 text-[11px] font-medium text-purple-300">
                <span className="bg-stone-800 px-2 py-1 rounded">Bancolombia</span>
                <span className="bg-stone-800 px-2 py-1 rounded">Nequi</span>
                <span className="bg-stone-800 px-2 py-1 rounded">Daviplata</span>
                <span className="bg-stone-800 px-2 py-1 rounded">Efectivo</span>
              </div>
              <p className="text-[11px] text-stone-500 pt-1">
                Verificación manual de comprobantes en menos de 2 horas hábiles.
              </p>
            </div>
          </div>

          {/* Contacto & Taller */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 tracking-wide">Contacto Directo</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-purple-400" />
                <span>+57 (300) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                <span>contacto@maranacrochet.co</span>
              </li>
              <li className="flex items-center gap-2 text-purple-300">
                <Instagram className="w-3.5 h-3.5" />
                <span>@maranacrochet</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 Maraña Crochet. Todos los derechos reservados.</p>
          <div className="flex items-center gap-1 text-stone-400 text-xs">
            <span>Hecho con amor y dedicación</span>
            <Heart className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
            <span>en Colombia</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
