import React from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  AlertTriangle,
  Upload,
  Star,
  ShoppingBag,
  ArrowRight,
  Eye,
  Building,
} from 'lucide-react';

export const CustomerOrdersView: React.FC = () => {
  const {
    orders,
    currentUser,
    setSelectedOrderForProof,
    setSelectedOrderForReview,
    setActiveTab,
    products,
    quickViewProduct,
  } = useApp();

  const customerOrders = orders.filter(
    (o) => !currentUser || o.userId === currentUser.id || o.userId === 'usr-customer-1'
  );

  const featuredRecommendations = products.slice(0, 3);

  const getStatusBadge = (order: Order) => {
    if (order.paymentStatus === 'rejected') {
      return (
        <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          Comprobante Rechazado
        </span>
      );
    }

    if (order.paymentStatus === 'pending_verification') {
      return (
        <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          Pago Pendiente de Verificación
        </span>
      );
    }

    switch (order.orderStatus) {
      case 'in_preparation':
        return (
          <span className="text-purple-800 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-purple-600" />
            En Preparación en el Taller
          </span>
        );
      case 'shipped':
        return (
          <span className="text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-blue-600" />
            Enviado / En Camino
          </span>
        );
      case 'delivered':
        return (
          <span className="text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Entregado con Éxito
          </span>
        );
      default:
        return (
          <span className="text-stone-700 bg-stone-100 px-2.5 py-1 rounded-md text-xs font-semibold">
            Registrado
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      {/* View Header */}
      <div className="border-b border-stone-200 pb-5 mb-8">
        <h2 className="font-display text-2xl font-bold text-stone-900">
          Mis Pedidos y Compras Artesanales (HU-22)
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Historial completo, estado de verificación de comprobantes y calificaciones.
        </p>
      </div>

      {customerOrders.length === 0 ? (
        // Empty state (Fase 4: Aún no tienes pedidos + botón)
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center space-y-4 max-w-md mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="font-display text-lg font-bold text-stone-900">
            Aún no tienes pedidos
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Tu historial de compras aparecerá aquí en cuanto realices tu primer pedido artesanal.
          </p>
          <button
            onClick={() => setActiveTab('catalog')}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-purple-900 hover:bg-purple-800 rounded-xl transition shadow-xs"
          >
            Explorar Catálogo
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {customerOrders.map((order) => {
            const hasRejectedPayment = order.paymentStatus === 'rejected';
            const isDelivered = order.orderStatus === 'delivered';

            return (
              <div
                key={order.id}
                className="bg-white border border-stone-200 rounded-2xl shadow-xs overflow-hidden transition hover:shadow-sm"
              >
                {/* Order Top Bar */}
                <div className="p-4 sm:p-5 bg-stone-50/80 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-stone-400 text-[11px] block font-mono">
                      FECHA: {new Date(order.createdAt).toLocaleDateString('es-CO')}
                    </span>
                    <span className="font-mono font-bold text-stone-900 text-sm">
                      {order.id}
                    </span>
                  </div>

                  {/* Status badge */}
                  <div>{getStatusBadge(order)}</div>
                </div>

                {/* If payment was rejected by admin: Display reason and Re-Report CTA */}
                {hasRejectedPayment && (
                  <div className="m-4 sm:m-5 p-4 bg-rose-50 border border-rose-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-start gap-2.5 text-rose-900">
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-bold">Comprobante de Pago Rechazado</strong>
                        <p className="text-rose-800 mt-0.5">
                          Motivo especificado por el taller:{' '}
                          <em>"{order.paymentProof?.rejectedReason || 'Comprobante ilegible o valor no coincide'}"</em>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedOrderForProof(order)}
                      className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-semibold text-xs whitespace-nowrap shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Reportar Pago Nuevamente</span>
                    </button>
                  </div>
                )}

                {/* Order Items List */}
                <div className="p-4 sm:p-5 divide-y divide-stone-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center gap-4">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover bg-stone-100 border border-stone-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-semibold text-stone-900 truncate">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                          <span>Cant: {item.quantity}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">
                            ${item.unitPrice.toLocaleString('es-CO')} c/u
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-xs sm:text-sm font-bold font-mono text-stone-900 tabular-nums">
                        ${(item.unitPrice * item.quantity).toLocaleString('es-CO')} COP
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary & Actions Footer */}
                <div className="p-4 sm:p-5 bg-stone-50/50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="text-stone-600">
                      <span>Destino: </span>
                      <strong className="text-stone-800">
                        {order.shippingAddress.address}, {order.shippingAddress.city}
                      </strong>
                    </div>
                    <div className="text-stone-500 text-[11px]">
                      Método:{' '}
                      <span className="font-medium">
                        {order.paymentMethod === 'transfer'
                          ? `Transferencia ${order.paymentProof?.bankName || ''}`
                          : 'Efectivo contraentrega'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right pr-2">
                      <span className="text-[11px] text-stone-400 block uppercase">Total Pagado</span>
                      <span className="text-base font-bold text-purple-950 font-mono tabular-nums">
                        ${order.total.toLocaleString('es-CO')} COP
                      </span>
                    </div>

                    {/* Action: If not paid yet or missing proof */}
                    {order.paymentStatus === 'pending_verification' && !order.paymentProof?.receiptNumber && (
                      <button
                        onClick={() => setSelectedOrderForProof(order)}
                        className="px-3.5 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-xs transition"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Adjuntar Comprobante</span>
                      </button>
                    )}

                    {/* Action: Rate Purchase (HU-18 / HU-43) when Delivered */}
                    {isDelivered && (
                      <div className="flex items-center gap-2">
                        {order.isReviewed ? (
                          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 font-medium rounded-lg border border-emerald-200 flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                            <span>Compra Calificada</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => setSelectedOrderForReview(order)}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition"
                          >
                            <Star className="w-3.5 h-3.5 fill-white" />
                            <span>Calificar tu compra (HU-18)</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Fase 5 Loopback: Productos que te pueden interesar (Carrusel de Retención HU-28) */}
      <div className="mt-16 pt-10 border-t border-stone-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display text-lg font-bold text-stone-900">
              Productos Destacados para Seguir Tejiendo Momentos (HU-28)
            </h3>
            <p className="text-xs text-stone-500">
              Recomendaciones basadas en las piezas más queridas del taller Maraña.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('catalog')}
            className="text-xs font-semibold text-purple-900 hover:underline flex items-center gap-1"
          >
            <span>Ver todo el catálogo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {featuredRecommendations.map((prod) => (
            <div
              key={prod.id}
              onClick={() => quickViewProduct(prod)}
              className="bg-white border border-stone-200 rounded-xl overflow-hidden p-3 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
            >
              <img
                src={prod.imageUrl}
                alt={prod.name}
                className="aspect-square w-full object-cover rounded-lg bg-stone-100"
              />
              <div className="pt-2">
                <span className="text-[10px] text-purple-700 font-bold uppercase tracking-wider">
                  {prod.category}
                </span>
                <h4 className="text-xs font-semibold text-stone-900 line-clamp-1">{prod.name}</h4>
                <div className="text-xs font-mono font-bold text-stone-900 mt-1 tabular-nums">
                  ${prod.price.toLocaleString('es-CO')} COP
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
