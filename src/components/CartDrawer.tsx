import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  ShoppingBag,
  AlertCircle,
  Check,
  Sparkles,
} from 'lucide-react';

interface CartDrawerProps {
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout }) => {
  const {
    role,
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    setIsAuthModalOpen,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [inlineErrors, setInlineErrors] = useState<Record<string, string>>({});

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = applyCoupon(couponInput);
    if (ok) {
      setCouponInput('');
    }
  };

  const handleQtyChange = (productId: string, newQty: number) => {
    const res = updateCartQuantity(productId, newQty);
    if (!res.success && res.message) {
      setInlineErrors((prev) => ({ ...prev, [productId]: res.message || '' }));
      setTimeout(() => {
        setInlineErrors((prev) => {
          const next = { ...prev };
          delete next[productId];
          return next;
        });
      }, 3000);
    }
  };

  const handleCheckoutClick = () => {
    if (role === 'visitor') {
      // Conversion Point (HU-01 / HU-02): Force Login/Register
      setIsCartOpen(false);
      setIsAuthModalOpen(true);
    } else {
      setIsCartOpen(false);
      onOpenCheckout();
    }
  };

  const shippingCost = cartSubtotal > 120000 ? 0 : 8000;
  const grandTotal = cartTotal + (cart.length > 0 ? shippingCost : 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-purple-900" />
            <h3 className="font-display text-lg font-bold text-stone-900">
              Bolsa de Compras ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-lg transition"
            aria-label="Cerrar bolsa"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body: Items list or Empty state */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-semibold text-stone-800 text-base">Tu bolsa está vacía</h4>
              <p className="text-xs text-stone-500 max-w-xs">
                Aún no has agregado ninguna ternura tejida a mano. ¡Explora nuestro catálogo para comenzar!
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-4 py-2 text-xs font-semibold text-purple-900 bg-purple-100 hover:bg-purple-200 rounded-lg transition"
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex gap-3 relative"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-18 h-18 object-cover rounded-lg bg-stone-200 shrink-0 border border-stone-200"
                  />

                  {/* Info & Stepper */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h5 className="text-xs font-semibold text-stone-900 truncate">
                        {item.product.name}
                      </h5>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-stone-400 hover:text-rose-600 transition p-1"
                        title="Eliminar artículo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-xs text-purple-900 font-bold font-mono tabular-nums">
                      ${item.unitPrice.toLocaleString('es-CO')} COP
                    </div>

                    {/* Inline stock error */}
                    {inlineErrors[item.productId] && (
                      <div className="text-[10px] text-rose-600 font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{inlineErrors[item.productId]}</span>
                      </div>
                    )}

                    {/* Stepper */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-200/60">
                      <div className="flex items-center border border-stone-300 rounded bg-white">
                        <button
                          onClick={() => handleQtyChange(item.productId, item.quantity - 1)}
                          className="px-2 py-0.5 text-stone-600 hover:text-stone-900 text-xs"
                          title="Restar uno"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQtyChange(item.productId, item.quantity + 1)}
                          className="px-2 py-0.5 text-stone-600 hover:text-stone-900 text-xs"
                          title="Sumar uno"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-xs font-semibold text-stone-800 font-mono tabular-nums">
                        ${(item.unitPrice * item.quantity).toLocaleString('es-CO')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-end">
                <button
                  onClick={clearCart}
                  className="text-[11px] text-stone-400 hover:text-stone-600 underline"
                >
                  Vaciar bolsa
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer: Coupon + Summary + CTA */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            {/* Coupon Section (HU-34) */}
            <div>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Cupón (ej. MARANA10)"
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-purple-700 bg-white"
                  />
                  <Tag className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 text-xs font-semibold text-purple-900 bg-purple-200 hover:bg-purple-300 rounded-lg transition"
                >
                  Aplicar
                </button>
              </form>

              {/* Inline coupon validation errors */}
              {couponError && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 animate-in fade-in">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{couponError}</span>
                </p>
              )}

              {/* Active coupon tag */}
              {appliedCoupon && (
                <div className="mt-1.5 flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{appliedCoupon.code} (-{appliedCoupon.discountPercent}%)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-stone-400 hover:text-rose-600 text-xs"
                    title="Remover cupón"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-200">
              <div className="flex justify-between">
                <span>Subtotal productos</span>
                <span className="font-mono tabular-nums text-stone-900">
                  ${cartSubtotal.toLocaleString('es-CO')} COP
                </span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Descuento aplicado</span>
                  <span className="font-mono tabular-nums">
                    -${cartDiscount.toLocaleString('es-CO')} COP
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Envío estimado</span>
                <span className="font-mono tabular-nums text-stone-900">
                  {shippingCost === 0 ? (
                    <span className="text-emerald-700 font-semibold">Gratis</span>
                  ) : (
                    `$${shippingCost.toLocaleString('es-CO')} COP`
                  )}
                </span>
              </div>

              {shippingCost > 0 && (
                <p className="text-[10px] text-purple-700">
                  Envío gratis en compras superiores a $120.000 COP
                </p>
              )}

              <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                <span>Total a Pagar</span>
                <span className="font-mono tabular-nums text-purple-950">
                  ${grandTotal.toLocaleString('es-CO')} COP
                </span>
              </div>
            </div>

            {/* Punto de Conversión Warning for Visitor (HU-01) */}
            {role === 'visitor' && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-[11px] text-amber-900 leading-tight">
                <strong>Paso de autenticación requerido:</strong> Al continuar, te pediremos iniciar sesión o registrarte para conservar tu pedido.
              </div>
            )}

            {/* Primary Buy CTA */}
            <button
              onClick={handleCheckoutClick}
              className="w-full py-3 px-4 bg-purple-900 hover:bg-purple-800 active:scale-98 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition shadow-md"
            >
              <span>{role === 'visitor' ? 'Iniciar Sesión y Finalizar' : 'Confirmar Pedido'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
