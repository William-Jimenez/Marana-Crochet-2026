import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order, Product, CustomQuoteRequest, ProductCategory } from '../types';
import {
  Package,
  TrendingUp,
  AlertTriangle,
  Users,
  CheckCircle,
  XCircle,
  Eye,
  Plus,
  Truck,
  DollarSign,
  Calendar,
  Sparkles,
  Building,
  ShieldCheck,
  Star,
  Search,
  Filter,
} from 'lucide-react';
import { MARANA_ASSETS } from '../data/mockData';

export const AdminDashboardView: React.FC = () => {
  const {
    orders,
    verifyOrderPayment,
    rejectOrderPayment,
    updateOrderStatus,
    quotes,
    adminQuotePrice,
    adminRejectQuote,
    products,
    updateProductStock,
    addProduct,
    suppliers,
    addSupplier,
    reviews,
    toggleReviewApproval,
  } = useApp();

  const [adminTab, setAdminTab] = useState<'orders' | 'quotes' | 'inventory' | 'suppliers' | 'reports' | 'reviews'>('orders');

  // Order proof inspection modal
  const [inspectingOrder, setInspectingOrder] = useState<Order | null>(null);

  // Reject payment modal with mandatory reason
  const [rejectingOrder, setRejectingOrder] = useState<Order | null>(null);
  const [rejectReason, setRejectReason] = useState('El comprobante no corresponde al valor total del pedido.');

  // Quote pricing modal
  const [quotingItem, setQuotingItem] = useState<CustomQuoteRequest | null>(null);
  const [quotePrice, setQuotePrice] = useState(85000);
  const [quoteDays, setQuoteDays] = useState(7);
  const [quoteAdminNote, setQuoteAdminNote] = useState('Incluye hilo de algodón peinado y caja de presentación.');

  // Add product modal
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>('amigurumis');
  const [newProdPrice, setNewProdPrice] = useState(48000);
  const [newProdStock, setNewProdStock] = useState(5);
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdSku, setNewProdSku] = useState('AMI-NEW-01');

  // Add supplier modal
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [supName, setSupName] = useState('');
  const [supContact, setSupContact] = useState('');
  const [supPhone, setSupPhone] = useState('');
  const [supCategory, setSupCategory] = useState('Hilos y Lanas');

  // Filter orders by status
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending_verification' | 'in_preparation' | 'delivered'>('all');

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    if (orderFilter === 'pending_verification') return o.paymentStatus === 'pending_verification';
    if (orderFilter === 'in_preparation') return o.orderStatus === 'in_preparation';
    if (orderFilter === 'delivered') return o.orderStatus === 'delivered';
    return true;
  });

  // Calculate Metrics (HU-16)
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'verified')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingVerificationCount = orders.filter(
    (o) => o.paymentStatus === 'pending_verification'
  ).length;

  const lowStockCount = products.filter(
    (p) => p.stock <= p.minStockAlert
  ).length;

  const handleVerify = (orderId: string) => {
    verifyOrderPayment(orderId);
    setInspectingOrder(null);
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingOrder || !rejectReason.trim()) return;
    rejectOrderPayment(rejectingOrder.id, rejectReason);
    setRejectingOrder(null);
    setInspectingOrder(null);
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quotingItem) return;
    adminQuotePrice(quotingItem.id, quotePrice, quoteDays, quoteAdminNote);
    setQuotingItem(null);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    addProduct({
      name: newProdName,
      category: newProdCategory,
      price: Number(newProdPrice),
      stock: Number(newProdStock),
      minStockAlert: 2,
      imageUrl: MARANA_ASSETS.spider,
      description: newProdDesc || 'Nueva creación artesanal hecha a mano.',
      details: ['100% Algodón', 'Tejido artesanal'],
      isFeatured: false,
      sku: newProdSku,
    });

    setIsAddProductOpen(false);
    setNewProdName('');
  };

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supName.trim()) return;

    addSupplier({
      name: supName,
      contactPerson: supContact,
      phone: supPhone,
      email: 'contacto@proveedor.co',
      category: supCategory,
      leadTimeDays: 3,
      lastRestockDate: '2026-04-01',
      notes: 'Insumo artesanal de calidad',
    });

    setIsAddSupplierOpen(false);
    setSupName('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28">
      {/* Admin Title & Top Stats Banner (HU-16, HU-40) */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Panel de Control Administrativo · Taller Maraña</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-stone-900">
              Gestión Comercial & Inventario
            </h1>
          </div>

          {/* Quick tab switcher buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-200/80 rounded-xl overflow-x-auto text-xs">
            <button
              onClick={() => setAdminTab('orders')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
                adminTab === 'orders' ? 'bg-white text-purple-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Pedidos ({orders.length})
            </button>
            <button
              onClick={() => setAdminTab('quotes')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
                adminTab === 'quotes' ? 'bg-white text-purple-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Cotizaciones ({quotes.filter((q) => q.status === 'pending').length})
            </button>
            <button
              onClick={() => setAdminTab('inventory')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
                adminTab === 'inventory' ? 'bg-white text-purple-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Inventario ({products.length})
            </button>
            <button
              onClick={() => setAdminTab('suppliers')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
                adminTab === 'suppliers' ? 'bg-white text-purple-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Proveedores
            </button>
            <button
              onClick={() => setAdminTab('reports')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
                adminTab === 'reports' ? 'bg-white text-purple-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Métricas
            </button>
            <button
              onClick={() => setAdminTab('reviews')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
                adminTab === 'reviews' ? 'bg-white text-purple-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Reseñas ({reviews.length})
            </button>
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            <span className="text-[11px] font-medium text-stone-500 block">Ventas Verificadas</span>
            <div className="text-xl font-bold font-mono text-purple-950 mt-1 tabular-nums">
              ${totalRevenue.toLocaleString('es-CO')} COP
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
              Directo en cuentas del taller
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            <span className="text-[11px] font-medium text-stone-500 block">Pagos por Verificar</span>
            <div className="text-xl font-bold font-mono text-amber-600 mt-1 tabular-nums">
              {pendingVerificationCount} pendientes
            </div>
            <span className="text-[10px] text-stone-500 mt-1 block">Requiere aprobación manual</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            <span className="text-[11px] font-medium text-stone-500 block">Alertas Stock Crítico</span>
            <div className="text-xl font-bold font-mono text-rose-600 mt-1 tabular-nums">
              {lowStockCount} artículos
            </div>
            <span className="text-[10px] text-stone-500 mt-1 block">Inventario ≤ 2 unidades</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            <span className="text-[11px] font-medium text-stone-500 block">Pedidos Totales</span>
            <div className="text-xl font-bold font-mono text-stone-900 mt-1 tabular-nums">
              {orders.length} pedidos
            </div>
            <span className="text-[10px] text-purple-700 font-semibold mt-1 block">
              Trazabilidad 100% digital
            </span>
          </div>
        </div>
      </div>

      {/* TAB 1: GESTIÓN DE PEDIDOS Y PAGOS MANUALES (HU-06, HU-15) */}
      {adminTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="font-display text-lg font-bold text-stone-900">
              Cola de Pedidos y Validación de Comprobantes (HU-15)
            </h3>

            {/* Status filters */}
            <div className="flex items-center gap-1.5 text-xs bg-stone-100 p-1 rounded-lg">
              <button
                onClick={() => setOrderFilter('all')}
                className={`px-3 py-1 rounded ${orderFilter === 'all' ? 'bg-white font-bold text-stone-900' : 'text-stone-600'}`}
              >
                Todos ({orders.length})
              </button>
              <button
                onClick={() => setOrderFilter('pending_verification')}
                className={`px-3 py-1 rounded ${orderFilter === 'pending_verification' ? 'bg-white font-bold text-amber-900' : 'text-stone-600'}`}
              >
                Por Verificar ({pendingVerificationCount})
              </button>
              <button
                onClick={() => setOrderFilter('in_preparation')}
                className={`px-3 py-1 rounded ${orderFilter === 'in_preparation' ? 'bg-white font-bold text-purple-900' : 'text-stone-600'}`}
              >
                En Taller
              </button>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold">
                  <tr>
                    <th className="p-3.5">Pedido</th>
                    <th className="p-3.5">Cliente</th>
                    <th className="p-3.5">Artículos</th>
                    <th className="p-3.5">Total</th>
                    <th className="p-3.5">Estado Pago</th>
                    <th className="p-3.5">Estado Pedido</th>
                    <th className="p-3.5 text-right">Acciones Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-stone-50/50 transition">
                      <td className="p-3.5 font-mono font-bold text-stone-900">
                        {ord.id}
                        <span className="block font-sans text-[10px] text-stone-400 font-normal">
                          {new Date(ord.createdAt).toLocaleDateString('es-CO')}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className="font-semibold text-stone-900 block">{ord.customerName}</span>
                        <span className="text-[10px] text-stone-400">{ord.customerPhone}</span>
                      </td>

                      <td className="p-3.5 max-w-xs truncate">
                        {ord.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                      </td>

                      <td className="p-3.5 font-mono font-bold tabular-nums text-stone-900">
                        ${ord.total.toLocaleString('es-CO')}
                      </td>

                      {/* Payment Status Column */}
                      <td className="p-3.5">
                        {ord.paymentStatus === 'pending_verification' && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            Por Verificar
                          </span>
                        )}
                        {ord.paymentStatus === 'verified' && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Verificado
                          </span>
                        )}
                        {ord.paymentStatus === 'rejected' && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                            Rechazado
                          </span>
                        )}
                      </td>

                      {/* Order status selector */}
                      <td className="p-3.5">
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                          className="bg-stone-100 border border-stone-200 text-stone-800 rounded p-1 text-[11px] font-medium"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="in_preparation">En preparación</option>
                          <option value="shipped">Enviado</option>
                          <option value="delivered">Entregado</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right space-x-1">
                        {/* Inspect voucher button */}
                        <button
                          onClick={() => setInspectingOrder(ord)}
                          className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs font-semibold inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Comprobante</span>
                        </button>

                        {/* Direct verify button */}
                        {ord.paymentStatus === 'pending_verification' && (
                          <button
                            onClick={() => handleVerify(ord.id)}
                            className="px-2.5 py-1 bg-purple-900 hover:bg-purple-800 text-white rounded text-xs font-semibold inline-flex items-center gap-1 shadow-xs"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Validar</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COTIZACIONES A MEDIDA (HU-35) */}
      {adminTab === 'quotes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-stone-900">
                Solicitudes de Pedidos Personalizados (HU-35)
              </h3>
              <p className="text-xs text-stone-500">
                Revisa los requerimientos a medida, calcula insumos y define el precio oficial.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quotes.map((q) => (
              <div
                key={q.id}
                className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-[10px] text-stone-400 block">{q.id}</span>
                    <h4 className="font-bold text-stone-900 text-sm">{q.itemType}</h4>
                    <span className="text-xs text-stone-500">
                      Cliente: {q.customerName} ({q.customerPhone})
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                      q.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : q.status === 'quoted'
                        ? 'bg-purple-100 text-purple-900'
                        : q.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {q.status === 'pending'
                      ? 'Pendiente'
                      : q.status === 'quoted'
                      ? 'Cotizado'
                      : q.status === 'accepted'
                      ? 'Aceptado'
                      : 'Rechazado'}
                  </span>
                </div>

                <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100 leading-relaxed">
                  "{q.description}"
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600">
                  <div>
                    <span className="text-stone-400 block">Medidas:</span>
                    <strong>{q.dimensions}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Colores:</span>
                    <strong>{q.preferredColors}</strong>
                  </div>
                </div>

                {q.quotedPrice && (
                  <div className="p-2.5 bg-purple-50 rounded-lg text-xs flex justify-between items-center text-purple-950 font-medium">
                    <span>Precio Asignado:</span>
                    <span className="font-mono font-bold text-sm">
                      ${q.quotedPrice.toLocaleString('es-CO')} COP ({q.estimatedDays} días)
                    </span>
                  </div>
                )}

                {/* Actions */}
                {q.status === 'pending' && (
                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
                    <button
                      onClick={() => adminRejectQuote(q.id, 'Capacidad de agenda de tejido llena para este mes.')}
                      className="px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-50 rounded-lg font-semibold"
                    >
                      Rechazar
                    </button>
                    <button
                      onClick={() => {
                        setQuotingItem(q);
                        setQuotePrice(85000);
                        setQuoteDays(7);
                      }}
                      className="px-4 py-1.5 bg-purple-900 hover:bg-purple-800 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Cotizar Proyecto</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: INVENTARIO & PRODUCTOS (HU-07, HU-13, HU-14, HU-25) */}
      {adminTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-bold text-stone-900">
                Control de Inventario y Existencias (HU-07, HU-14)
              </h3>
              <p className="text-xs text-stone-500">
                El stock se descuenta automáticamente con cada venta. Modifica existencias en tiempo real.
              </p>
            </div>

            <button
              onClick={() => setIsAddProductOpen(true)}
              className="px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Producto en Catálogo (HU-13)</span>
            </button>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold">
                  <tr>
                    <th className="p-3.5">Producto</th>
                    <th className="p-3.5">Categoría</th>
                    <th className="p-3.5">Precio</th>
                    <th className="p-3.5">Ventas Acumuladas</th>
                    <th className="p-3.5">Stock en Taller</th>
                    <th className="p-3.5">Alerta</th>
                    <th className="p-3.5 text-right">Ajustar Unidades</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((p) => {
                    const isLow = p.stock <= p.minStockAlert;
                    return (
                      <tr key={p.id} className="hover:bg-stone-50/50 transition">
                        <td className="p-3.5 flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-stone-100 border border-stone-200"
                          />
                          <div>
                            <span className="font-semibold text-stone-900 block">{p.name}</span>
                            <span className="text-[10px] text-stone-400 font-mono">SKU: {p.sku}</span>
                          </div>
                        </td>

                        <td className="p-3.5 font-medium text-stone-600 capitalize">{p.category}</td>

                        <td className="p-3.5 font-mono font-bold tabular-nums text-stone-900">
                          ${p.price.toLocaleString('es-CO')}
                        </td>

                        <td className="p-3.5 font-mono tabular-nums text-stone-600">
                          {p.salesCount} vendidos
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`font-mono font-bold text-sm tabular-nums ${
                              p.stock === 0
                                ? 'text-rose-600'
                                : isLow
                                ? 'text-amber-600'
                                : 'text-emerald-700'
                            }`}
                          >
                            {p.stock} unids.
                          </span>
                        </td>

                        <td className="p-3.5">
                          {p.stock === 0 ? (
                            <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[10px] font-bold">
                              AGOTADO
                            </span>
                          ) : isLow ? (
                            <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold">
                              BAJO STOCK (HU-25)
                            </span>
                          ) : (
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-medium">
                              Óptimo
                            </span>
                          )}
                        </td>

                        {/* Inline Stepper adjustment */}
                        <td className="p-3.5 text-right">
                          <div className="inline-flex items-center border border-stone-300 rounded-lg bg-stone-50">
                            <button
                              onClick={() => updateProductStock(p.id, p.stock - 1)}
                              className="px-2.5 py-1 text-stone-600 hover:text-stone-900 font-bold hover:bg-stone-200 rounded-l"
                              title="Restar una unidad"
                            >
                              -
                            </button>
                            <span className="px-2 font-mono font-bold text-xs">{p.stock}</span>
                            <button
                              onClick={() => updateProductStock(p.id, p.stock + 1)}
                              className="px-2.5 py-1 text-stone-600 hover:text-stone-900 font-bold hover:bg-stone-200 rounded-r"
                              title="Sumar una unidad"
                            >
                              +
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PROVEEDORES (HU-26, HU-37) */}
      {adminTab === 'suppliers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-stone-900">
                Directorio de Proveedores de Insumos (HU-26)
              </h3>
              <p className="text-xs text-stone-500">
                Control de aprovisionamiento de lana, hilos, ojos de seguridad y cajas kraft.
              </p>
            </div>

            <button
              onClick={() => setIsAddSupplierOpen(true)}
              className="px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Proveedor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {suppliers.map((sup) => (
              <div
                key={sup.id}
                className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-purple-700" />
                  <h4 className="font-bold text-stone-900 text-sm">{sup.name}</h4>
                </div>

                <div className="space-y-1.5 text-xs text-stone-600">
                  <div>
                    <span className="text-stone-400">Insumos: </span>
                    <strong className="text-stone-800">{sup.category}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400">Contacto: </span>
                    <span>{sup.contactPerson}</span>
                  </div>
                  <div>
                    <span className="text-stone-400">Teléfono: </span>
                    <span className="font-mono text-purple-900 font-semibold">{sup.phone}</span>
                  </div>
                  <div>
                    <span className="text-stone-400">Tiempo de entrega: </span>
                    <span>{sup.leadTimeDays} días hábiles</span>
                  </div>
                </div>

                <div className="p-2.5 bg-stone-50 rounded-xl text-[11px] text-stone-500 border border-stone-100">
                  {sup.notes}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: REPORTES Y MÉTRICAS (HU-16, HU-40) */}
      {adminTab === 'reports' && (
        <div className="space-y-6">
          <h3 className="font-display text-lg font-bold text-stone-900">
            Reportes Comerciales y Desempeño del Taller (HU-16)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Products Table */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h4 className="font-bold text-stone-900 text-sm">
                Productos Más Vendidos (Lógica de Ventas Reales)
              </h4>
              <div className="divide-y divide-stone-100 text-xs">
                {products
                  .sort((a, b) => b.salesCount - a.salesCount)
                  .map((p, idx) => (
                    <div key={p.id} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-purple-800 w-4">#{idx + 1}</span>
                        <span className="font-semibold text-stone-800">{p.name}</span>
                      </div>
                      <span className="font-mono font-bold text-stone-900 tabular-nums">
                        {p.salesCount} unidades
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h4 className="font-bold text-stone-900 text-sm">
                Resumen de Transacciones Registradas
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between p-3 bg-purple-50 rounded-xl text-purple-950">
                  <span>Total Recaudado (Vía Transferencia):</span>
                  <strong className="font-mono tabular-nums text-sm">
                    ${totalRevenue.toLocaleString('es-CO')} COP
                  </strong>
                </div>
                <div className="flex justify-between p-3 bg-stone-50 rounded-xl text-stone-700">
                  <span>Valor Estimado de Inventario en Existencias:</span>
                  <strong className="font-mono tabular-nums text-sm">
                    $
                    {products
                      .reduce((sum, p) => sum + p.price * p.stock, 0)
                      .toLocaleString('es-CO')}{' '}
                    COP
                  </strong>
                </div>
                <div className="flex justify-between p-3 bg-stone-50 rounded-xl text-stone-700">
                  <span>Tasa de Aprobación de Comprobantes:</span>
                  <strong className="font-mono tabular-nums text-sm">96.4%</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: MODERACIÓN DE RESEÑAS (HU-27) */}
      {adminTab === 'reviews' && (
        <div className="space-y-6">
          <h3 className="font-display text-lg font-bold text-stone-900">
            Moderación de Reseñas de Clientes (HU-27)
          </h3>

          <div className="bg-white border border-stone-200 rounded-2xl divide-y divide-stone-100 shadow-xs">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900">{rev.customerName}</span>
                    <span className="text-stone-400">· {rev.productName}</span>
                    <div className="flex text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-stone-600 italic">"{rev.comment}"</p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                      rev.isApproved ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {rev.isApproved ? 'Visible en Tienda' : 'Oculto'}
                  </span>
                  <button
                    onClick={() => toggleReviewApproval(rev.id)}
                    className="px-3 py-1.5 border border-stone-300 hover:bg-stone-50 rounded-lg text-xs font-semibold"
                  >
                    {rev.isApproved ? 'Ocultar' : 'Aprobar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: INSPECCIONAR COMPROBANTE DE PAGO (HU-06) */}
      {inspectingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-stone-200 overflow-hidden p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200">
              <h3 className="font-bold text-stone-900 text-base">
                Comprobante de Pago · Pedido {inspectingOrder.id}
              </h3>
              <button
                onClick={() => setInspectingOrder(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-stone-50 p-2.5 rounded-lg">
                <span>Cliente:</span>
                <strong>{inspectingOrder.customerName}</strong>
              </div>
              <div className="flex justify-between bg-stone-50 p-2.5 rounded-lg">
                <span>Total a verificar:</span>
                <strong className="font-mono text-purple-950 font-bold">
                  ${inspectingOrder.total.toLocaleString('es-CO')} COP
                </strong>
              </div>
              <div className="flex justify-between bg-stone-50 p-2.5 rounded-lg">
                <span>Entidad / Banco:</span>
                <strong>{inspectingOrder.paymentProof?.bankName || 'N/A'}</strong>
              </div>
              <div className="flex justify-between bg-stone-50 p-2.5 rounded-lg">
                <span>Ref. Transacción:</span>
                <strong className="font-mono">{inspectingOrder.paymentProof?.receiptNumber || 'N/A'}</strong>
              </div>
            </div>

            {/* Proof image preview */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
              <img
                src={inspectingOrder.paymentProof?.imageUrl || MARANA_ASSETS.hero}
                alt="Comprobante"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Verification actions */}
            <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-200">
              <button
                onClick={() => {
                  setRejectingOrder(inspectingOrder);
                  setInspectingOrder(null);
                }}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-semibold"
              >
                Rechazar Comprobante
              </button>
              <button
                onClick={() => handleVerify(inspectingOrder.id)}
                className="px-5 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Confirmar Pago y Enviar a Taller</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: RECHAZAR COMPROBANTE CON MOTIVO OBLIGATORIO (Edge Case) */}
      {rejectingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleRejectSubmit}
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-stone-200 p-6 space-y-4"
          >
            <div className="flex items-center gap-2 text-rose-700">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-stone-900 text-base">
                Rechazar Comprobante ({rejectingOrder.id})
              </h3>
            </div>

            <p className="text-xs text-stone-600">
              El cliente recibirá una notificación inmediata con este motivo y un botón prioritario para reportar el comprobante nuevamente.
            </p>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Motivo del Rechazo (Obligatorio) *
              </label>
              <textarea
                required
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-2.5 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-rose-700 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setRejectingOrder(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                Confirmar Rechazo
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: COTIZAR PRECIO (HU-35) */}
      {quotingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleQuoteSubmit}
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-stone-200 p-6 space-y-4"
          >
            <div className="flex items-center gap-2 text-purple-700">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-bold text-stone-900 text-base">
                Cotizar Proyecto a Medida
              </h3>
            </div>

            <p className="text-xs text-stone-600">
              Solicitud: <strong>{quotingItem.itemType}</strong> ({quotingItem.customerName})
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Precio Total en COP ($) *
                </label>
                <input
                  type="number"
                  required
                  value={quotePrice}
                  onChange={(e) => setQuotePrice(Number(e.target.value))}
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-purple-700 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Días Hábiles Estimados de Confección *
                </label>
                <input
                  type="number"
                  required
                  value={quoteDays}
                  onChange={(e) => setQuoteDays(Number(e.target.value))}
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-purple-700 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Nota o Especificación de Materiales para el Cliente
                </label>
                <input
                  type="text"
                  value={quoteAdminNote}
                  onChange={(e) => setQuoteAdminNote(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-purple-700"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setQuotingItem(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-purple-900 hover:bg-purple-800 text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                Enviar Cotización al Cliente
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 4: CREAR PRODUCTO (HU-13) */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateProduct}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-stone-200 p-6 space-y-4"
          >
            <h3 className="font-bold text-stone-900 text-base">
              Agregar Nueva Creación al Catálogo (HU-13)
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="block font-medium text-stone-700 mb-1">Nombre del Producto *</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-purple-700"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Categoría *</label>
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value as ProductCategory)}
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-purple-700 bg-white"
                >
                  <option value="amigurumis">Amigurumis</option>
                  <option value="prendas">Prendas</option>
                  <option value="accesorios">Accesorios</option>
                  <option value="kits_patrones">Kits & Patrones</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Código SKU *</label>
                <input
                  type="text"
                  required
                  value={newProdSku}
                  onChange={(e) => setNewProdSku(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-purple-700 font-mono uppercase"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Precio en COP ($) *</label>
                <input
                  type="number"
                  required
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(Number(e.target.value))}
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-purple-700 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Stock Inicial *</label>
                <input
                  type="number"
                  required
                  value={newProdStock}
                  onChange={(e) => setNewProdStock(Number(e.target.value))}
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-purple-700 font-mono"
                />
              </div>

              <div className="col-span-2">
                <label className="block font-medium text-stone-700 mb-1">Descripción Artesanal</label>
                <textarea
                  rows={2}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-purple-700"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setIsAddProductOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-purple-900 hover:bg-purple-800 text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                Guardar en Catálogo
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 5: REGISTRAR PROVEEDOR */}
      {isAddSupplierOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateSupplier}
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-stone-200 p-6 space-y-4"
          >
            <h3 className="font-bold text-stone-900 text-base">
              Nuevo Proveedor de Insumos (HU-26)
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Nombre Comercial *</label>
                <input
                  type="text"
                  required
                  value={supName}
                  onChange={(e) => setSupName(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-purple-700"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Persona de Contacto</label>
                <input
                  type="text"
                  value={supContact}
                  onChange={(e) => setSupContact(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-purple-700"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Teléfono / WhatsApp *</label>
                <input
                  type="text"
                  required
                  value={supPhone}
                  onChange={(e) => setSupPhone(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-purple-700 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Categoría de Insumos</label>
                <input
                  type="text"
                  value={supCategory}
                  onChange={(e) => setSupCategory(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-purple-700"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setIsAddSupplierOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-purple-900 hover:bg-purple-800 text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                Guardar Proveedor
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
