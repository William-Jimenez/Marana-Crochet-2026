import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  User,
  Product,
  CartItem,
  Order,
  CustomQuoteRequest,
  Review,
  VirtualClass,
  Supplier,
  Coupon,
  AppNotification,
  ProductCategory,
  PaymentMethod,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_SUPPLIERS,
  INITIAL_VIRTUAL_CLASSES,
  AVAILABLE_COUPONS,
  MOCK_USERS,
  MARANA_ASSETS,
} from '../data/mockData';

interface AppContextType {
  // Role & Auth
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: User | null;
  loginAsCustomer: () => void;
  loginAsAdmin: () => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  
  // Navigation
  activeTab: 'catalog' | 'orders' | 'favorites' | 'quotes' | 'classes' | 'admin';
  setActiveTab: (tab: 'catalog' | 'orders' | 'favorites' | 'quotes' | 'classes' | 'admin') => void;

  // Catalog & Filters
  products: Product[];
  selectedCategory: ProductCategory | 'all';
  setSelectedCategory: (category: ProductCategory | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onlyInStock: boolean;
  setOnlyInStock: (only: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  quickViewProduct: (product: Product) => void;

  // Favorites
  favorites: string[]; // product IDs
  toggleFavorite: (productId: string) => void;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number) => { success: boolean; message?: string };
  updateCartQuantity: (productId: string, quantity: number) => { success: boolean; message?: string };
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartTotal: number;
  appliedCoupon: Coupon | null;
  couponError: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;

  // Checkout & Orders
  orders: Order[];
  createOrder: (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: { address: string; city: string; notes?: string };
    paymentMethod: PaymentMethod;
  }) => Order | null;
  selectedOrderForProof: Order | null;
  setSelectedOrderForProof: (order: Order | null) => void;
  submitPaymentProof: (orderId: string, proof: { bankName: string; receiptNumber?: string; imageUrl?: string }) => void;
  
  // Admin Order Actions
  verifyOrderPayment: (orderId: string) => void;
  rejectOrderPayment: (orderId: string, reason: string) => void;
  updateOrderStatus: (orderId: string, status: Order['orderStatus']) => void;

  // Custom Quotes (HU-35)
  quotes: CustomQuoteRequest[];
  createQuoteRequest: (data: Omit<CustomQuoteRequest, 'id' | 'userId' | 'status' | 'createdAt'>) => void;
  adminQuotePrice: (quoteId: string, price: number, estimatedDays: number, adminNote?: string) => void;
  adminRejectQuote: (quoteId: string, adminNote: string) => void;
  customerAcceptQuote: (quoteId: string) => void;

  // Reviews
  reviews: Review[];
  selectedOrderForReview: Order | null;
  setSelectedOrderForReview: (order: Order | null) => void;
  submitReview: (productId: string, orderId: string, rating: number, comment: string) => void;
  toggleReviewApproval: (reviewId: string) => void;

  // Virtual Classes
  virtualClasses: VirtualClass[];
  toggleLessonCompleted: (classId: string, moduleId: string) => void;
  enrollInClass: (classId: string) => void;

  // Inventory & Product Management (Admin)
  addProduct: (product: Omit<Product, 'id' | 'salesCount' | 'rating' | 'reviewCount'>) => void;
  updateProductStock: (productId: string, newStock: number) => void;
  updateProduct: (updated: Product) => void;

  // Suppliers
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;

  // Modals & UI States
  isQuoteModalOpen: boolean;
  setIsQuoteModalOpen: (open: boolean) => void;
  checkoutSuccessOrder: Order | null;
  setCheckoutSuccessOrder: (order: Order | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('visitor');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'catalog' | 'orders' | 'favorites' | 'quotes' | 'classes' | 'admin'>('catalog');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Catalog State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(['prod-1']);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Order Proof & Reviews
  const [selectedOrderForProof, setSelectedOrderForProof] = useState<Order | null>(null);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState<Order | null>(null);
  const [checkoutSuccessOrder, setCheckoutSuccessOrder] = useState<Order | null>(null);

  // Pre-seeded Orders for demonstrability
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'MAR-2026-1042',
      userId: 'usr-customer-1',
      customerName: 'Sofía Rodríguez',
      customerEmail: 'sofia.crochet@gmail.com',
      customerPhone: '+57 315 889 4421',
      shippingAddress: {
        address: 'Carrera 43A # 18 Sur - 45, Apto 502',
        city: 'Medellín, Antioquia',
        notes: 'Dejar en portería con vigilancia',
      },
      items: [
        {
          productId: 'prod-1',
          name: 'Amigurumi Maraña Arañita Kawaii',
          quantity: 1,
          unitPrice: 45000,
          imageUrl: MARANA_ASSETS.spider,
        },
      ],
      subtotal: 45000,
      discount: 4500,
      couponCode: 'MARANA10',
      shippingCost: 8000,
      total: 48500,
      paymentMethod: 'transfer',
      paymentStatus: 'pending_verification',
      orderStatus: 'pending',
      paymentProof: {
        bankName: 'Nequi',
        receiptNumber: 'NEQ-83749219',
        imageUrl: MARANA_ASSETS.hero,
        submittedAt: '2026-04-06T14:30:00Z',
      },
      createdAt: '2026-04-06T14:20:00Z',
      updatedAt: '2026-04-06T14:30:00Z',
    },
    {
      id: 'MAR-2026-0988',
      userId: 'usr-customer-1',
      customerName: 'Sofía Rodríguez',
      customerEmail: 'sofia.crochet@gmail.com',
      customerPhone: '+57 315 889 4421',
      shippingAddress: {
        address: 'Carrera 43A # 18 Sur - 45, Apto 502',
        city: 'Medellín, Antioquia',
      },
      items: [
        {
          productId: 'prod-3',
          name: 'Bolso Tote Bag Floral Maraña',
          quantity: 1,
          unitPrice: 68000,
          imageUrl: MARANA_ASSETS.tote,
        },
      ],
      subtotal: 68000,
      discount: 0,
      shippingCost: 8000,
      total: 76000,
      paymentMethod: 'transfer',
      paymentStatus: 'verified',
      orderStatus: 'delivered',
      isReviewed: false,
      createdAt: '2026-03-24T10:00:00Z',
      updatedAt: '2026-03-28T16:00:00Z',
    },
  ]);

  // Pre-seeded Custom Quotes (HU-35)
  const [quotes, setQuotes] = useState<CustomQuoteRequest[]>([
    {
      id: 'Q-2026-01',
      userId: 'usr-customer-1',
      customerName: 'Sofía Rodríguez',
      customerEmail: 'sofia.crochet@gmail.com',
      customerPhone: '+57 315 889 4421',
      itemType: 'Amigurumi de Mascota Personalizado',
      description: 'Quiero un perrito Schnauzer gris con bigote blanco y collar lila con dije de estrella.',
      dimensions: '20 cm de alto aproximado',
      preferredColors: 'Gris jaspeado, blanco invierno, lila pastel',
      status: 'pending',
      createdAt: '2026-04-05T11:15:00Z',
    },
  ]);

  // Pre-seeded Reviews (HU-18)
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'rev-1',
      productId: 'prod-1',
      productName: 'Amigurumi Maraña Arañita Kawaii',
      orderId: 'MAR-2026-0850',
      customerName: 'Mariana Duque',
      rating: 5,
      comment: '¡Es la cosita más tierna del mundo! Los ojitos bordados y la textura del algodón son inmejorables. Llegó con un olor delicioso a lavanda.',
      date: 'Hace 3 días',
      isApproved: true,
    },
    {
      id: 'rev-2',
      productId: 'prod-2',
      productName: 'Cardigan Granny Violeta & Lavanda',
      orderId: 'MAR-2026-0812',
      customerName: 'Camila Ospina',
      rating: 5,
      comment: 'La calidad del tejido es nivel obra de arte. Se nota que tardaron muchas horas haciéndolo a mano. Muy calientito y los colores son idénticos a la foto.',
      date: 'Hace 1 semana',
      isApproved: true,
    },
  ]);

  // Suppliers & Virtual Classes
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [virtualClasses, setVirtualClasses] = useState<VirtualClass[]>(INITIAL_VIRTUAL_CLASSES);

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: '¡Bienvenida a Maraña Crochet!',
      message: 'Explora nuestro catálogo de amigurumis y prendas artesanales hechas a mano.',
      timestamp: 'Ahora',
      isRead: false,
      type: 'system',
    },
  ]);

  // Role switching helpers
  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'admin') {
      setCurrentUser(MOCK_USERS.admin);
      setActiveTab('admin');
    } else if (newRole === 'customer') {
      setCurrentUser(MOCK_USERS.customer);
      if (activeTab === 'admin') setActiveTab('catalog');
    } else {
      setCurrentUser(null);
      if (activeTab === 'admin' || activeTab === 'orders' || activeTab === 'quotes') {
        setActiveTab('catalog');
      }
    }
  };

  const loginAsCustomer = () => {
    setRole('customer');
    setIsAuthModalOpen(false);
    // Add toast notification
    addNotification('Sesión Iniciada', 'Has ingresado como Sofía Rodríguez (Cliente).', 'system');
  };

  const loginAsAdmin = () => {
    setRole('admin');
    setIsAuthModalOpen(false);
    addNotification('Modo Administrador', 'Acceso habilitado al panel administrativo de Maraña Crochet.', 'system');
  };

  const logout = () => {
    setRole('visitor');
    addNotification('Sesión Finalizada', 'Ahora estás navegando como Visitante anónimo.', 'system');
  };

  const addNotification = (title: string, message: string, type: AppNotification['type'], orderId?: string) => {
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      title,
      message,
      timestamp: 'Hace un momento',
      isRead: false,
      type,
      orderId,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Favorites
  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Quick view product
  const quickViewProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  // Cart Management
  const addToCart = (product: Product, quantity = 1) => {
    // Stock validation
    const existing = cart.find((item) => item.productId === product.id);
    const currentQty = existing ? existing.quantity : 0;
    const targetQty = currentQty + quantity;

    if (targetQty > product.stock) {
      return {
        success: false,
        message: `Solo quedan ${product.stock} unidades disponibles de "${product.name}".`,
      };
    }

    if (existing) {
      setCart((prev) =>
        prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: targetQty } : item
        )
      );
    } else {
      setCart((prev) => [
        ...prev,
        {
          productId: product.id,
          quantity,
          unitPrice: product.price,
          product,
        },
      ]);
    }

    return { success: true };
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    const item = cart.find((i) => i.productId === productId);
    if (!item) return { success: false };

    if (quantity <= 0) {
      removeFromCart(productId);
      return { success: true };
    }

    if (quantity > item.product.stock) {
      return {
        success: false,
        message: `Cantidad no disponible. El inventario máximo es de ${item.product.stock} unidades.`,
      };
    }

    setCart((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
    return { success: true };
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setCouponError(null);
  };

  // Cart totals calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const cartDiscount = appliedCoupon
    ? Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100)
    : 0;

  const cartTotal = Math.max(0, cartSubtotal - cartDiscount);

  // Coupon application (HU-34)
  const applyCoupon = (code: string) => {
    const cleaned = code.trim().toUpperCase();
    const found = AVAILABLE_COUPONS.find((c) => c.code === cleaned);

    if (!found) {
      setCouponError('El cupón ingresado no es válido o ha expirado.');
      setAppliedCoupon(null);
      return false;
    }

    if (!found.isActive) {
      setCouponError('Este código de descuento ha expirado.');
      setAppliedCoupon(null);
      return false;
    }

    if (cartSubtotal < found.minPurchase) {
      setCouponError(
        `Este cupón requiere una compra mínima de $${found.minPurchase.toLocaleString('es-CO')} COP.`
      );
      setAppliedCoupon(null);
      return false;
    }

    setAppliedCoupon(found);
    setCouponError(null);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  // Order Placement (Happy Path HU-05, HU-12)
  const createOrder = (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: { address: string; city: string; notes?: string };
    paymentMethod: PaymentMethod;
  }) => {
    if (cart.length === 0) return null;

    // Check stock for all items
    for (const item of cart) {
      const p = products.find((prod) => prod.id === item.productId);
      if (!p || p.stock < item.quantity) {
        return null;
      }
    }

    // Generate unique order ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `MAR-2026-${randomNum}`;

    const newOrder: Order = {
      id: orderId,
      userId: currentUser?.id || 'usr-temp',
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      shippingAddress: orderData.shippingAddress,
      items: cart.map((item) => ({
        productId: item.productId,
        name: item.product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        imageUrl: item.product.imageUrl,
      })),
      subtotal: cartSubtotal,
      discount: cartDiscount,
      couponCode: appliedCoupon?.code,
      shippingCost: cartSubtotal > 120000 ? 0 : 8000,
      total: cartTotal + (cartSubtotal > 120000 ? 0 : 8000),
      paymentMethod: orderData.paymentMethod,
      paymentStatus: 'pending_verification',
      orderStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Deduct stock immediately (RF14)
    setProducts((prev) =>
      prev.map((prod) => {
        const inCart = cart.find((c) => c.productId === prod.id);
        if (inCart) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - inCart.quantity),
            salesCount: prod.salesCount + inCart.quantity,
          };
        }
        return prod;
      })
    );

    // Save order
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setCheckoutSuccessOrder(newOrder);

    addNotification(
      '¡Pedido Confirmado!',
      `Tu pedido #${orderId} ha sido registrado. Por favor adjunta el comprobante de pago para comenzar a tejerlo.`,
      'order',
      orderId
    );

    return newOrder;
  };

  // Submit payment proof (HU-06)
  const submitPaymentProof = (
    orderId: string,
    proof: { bankName: string; receiptNumber?: string; imageUrl?: string }
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            paymentStatus: 'pending_verification',
            paymentProof: {
              bankName: proof.bankName,
              receiptNumber: proof.receiptNumber,
              imageUrl: proof.imageUrl || MARANA_ASSETS.hero,
              submittedAt: new Date().toISOString(),
              rejectedReason: undefined, // clear previous rejection
            },
            updatedAt: new Date().toISOString(),
          };
        }
        return ord;
      })
    );

    addNotification(
      'Comprobante Enviado',
      `El comprobante del pedido #${orderId} fue enviado y está pendiente de verificación por el taller Maraña.`,
      'payment',
      orderId
    );

    setSelectedOrderForProof(null);
  };

  // Admin verifies payment (HU-06, HU-15)
  const verifyOrderPayment = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            paymentStatus: 'verified',
            orderStatus: 'in_preparation',
            updatedAt: new Date().toISOString(),
          };
        }
        return ord;
      })
    );

    addNotification(
      '¡Pago Verificado!',
      `El pago de tu pedido #${orderId} fue aprobado. Tu pedido pasa al estado "En preparación" en el taller.`,
      'order',
      orderId
    );
  };

  // Admin rejects payment (Edge Case)
  const rejectOrderPayment = (orderId: string, reason: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            paymentStatus: 'rejected',
            paymentProof: ord.paymentProof
              ? { ...ord.paymentProof, rejectedReason: reason }
              : {
                  bankName: 'N/A',
                  submittedAt: new Date().toISOString(),
                  rejectedReason: reason,
                },
            updatedAt: new Date().toISOString(),
          };
        }
        return ord;
      })
    );

    addNotification(
      'Comprobante de Pago Rechazado',
      `El comprobante para el pedido #${orderId} fue rechazado. Motivo: ${reason}`,
      'payment',
      orderId
    );
  };

  // Admin updates order status
  const updateOrderStatus = (orderId: string, status: Order['orderStatus']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, orderStatus: status, updatedAt: new Date().toISOString() } : ord))
    );

    let statusMsg = '';
    if (status === 'shipped') statusMsg = 'Tu pedido ha sido despachado y va en camino.';
    if (status === 'delivered') statusMsg = 'Tu pedido ha sido entregado con éxito. ¡Ya puedes calificar tu compra!';

    if (statusMsg) {
      addNotification('Actualización de Pedido', `Pedido #${orderId}: ${statusMsg}`, 'order', orderId);
    }
  };

  // Custom Quote Requests (HU-35)
  const createQuoteRequest = (data: Omit<CustomQuoteRequest, 'id' | 'userId' | 'status' | 'createdAt'>) => {
    const newQuote: CustomQuoteRequest = {
      ...data,
      id: `COT-2026-${Math.floor(100 + Math.random() * 900)}`,
      userId: currentUser?.id || 'usr-temp',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setQuotes((prev) => [newQuote, ...prev]);
    setIsQuoteModalOpen(false);

    addNotification(
      'Cotización Enviada',
      'Tu solicitud de diseño a medida fue recibida. Valentina revisará la viabilidad y responderá pronto.',
      'quote'
    );
  };

  const adminQuotePrice = (quoteId: string, price: number, estimatedDays: number, adminNote?: string) => {
    setQuotes((prev) =>
      prev.map((q) =>
        q.id === quoteId
          ? {
              ...q,
              status: 'quoted',
              quotedPrice: price,
              estimatedDays,
              adminNote,
            }
          : q
      )
    );

    addNotification(
      '¡Tu Cotización Está Lista!',
      `Maraña ha cotizado tu proyecto personalizado (#${quoteId}) por $${price.toLocaleString('es-CO')} COP.`,
      'quote'
    );
  };

  const adminRejectQuote = (quoteId: string, adminNote: string) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, status: 'rejected', adminNote } : q))
    );

    addNotification(
      'Cotización No Aprobada',
      `Tu solicitud #${quoteId} no pudo ser aceptada por disponibilidad o complejidad técnica.`,
      'quote'
    );
  };

  const customerAcceptQuote = (quoteId: string) => {
    const q = quotes.find((item) => item.id === quoteId);
    if (!q || !q.quotedPrice) return;

    // Convert accepted quote into an order
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `MAR-2026-${randomNum}`;

    const newOrder: Order = {
      id: orderId,
      userId: q.userId,
      customerName: q.customerName,
      customerEmail: q.customerEmail,
      customerPhone: q.customerPhone,
      shippingAddress: {
        address: 'Dirección por confirmar',
        city: 'Medellín',
        notes: `Pedido Personalizado: ${q.itemType} (${q.dimensions})`,
      },
      items: [
        {
          productId: 'custom-quote',
          name: `Diseño a Medida: ${q.itemType}`,
          quantity: 1,
          unitPrice: q.quotedPrice,
          imageUrl: q.referenceImage || MARANA_ASSETS.spider,
        },
      ],
      subtotal: q.quotedPrice,
      discount: 0,
      shippingCost: 8000,
      total: q.quotedPrice + 8000,
      paymentMethod: 'transfer',
      paymentStatus: 'pending_verification',
      orderStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setQuotes((prev) => prev.map((item) => (item.id === quoteId ? { ...item, status: 'accepted' } : item)));

    addNotification(
      'Cotización Aceptada',
      `Se ha creado el pedido #${orderId} para tu diseño personalizado. Ya puedes reportar el pago del 50% de anticipo.`,
      'order',
      orderId
    );

    setActiveTab('orders');
    setSelectedOrderForProof(newOrder);
  };

  // Review submission (HU-18)
  const submitReview = (productId: string, orderId: string, rating: number, comment: string) => {
    const targetProduct = products.find((p) => p.id === productId);
    const newRev: Review = {
      id: 'rev-' + Date.now(),
      productId,
      productName: targetProduct ? targetProduct.name : 'Producto Maraña',
      orderId,
      customerName: currentUser?.name || 'Cliente Verificado',
      rating,
      comment,
      date: 'Reciente',
      isApproved: true,
    };

    setReviews((prev) => [newRev, ...prev]);

    // Update order status so it is marked reviewed
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, isReviewed: true } : ord))
    );

    // Update product rating and review count
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newCount = p.reviewCount + 1;
          const newAvg = Number(((p.rating * p.reviewCount + rating) / newCount).toFixed(1));
          return { ...p, reviewCount: newCount, rating: newAvg };
        }
        return p;
      })
    );

    setSelectedOrderForReview(null);

    addNotification(
      '¡Gracias por tu reseña!',
      'Tu opinión ayuda a valorar el trabajo de nuestras artesanas de crochet.',
      'system'
    );
  };

  const toggleReviewApproval = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, isApproved: !r.isApproved } : r))
    );
  };

  // Virtual Classes (HU-19, HU-50)
  const toggleLessonCompleted = (classId: string, moduleId: string) => {
    setVirtualClasses((prev) =>
      prev.map((cls) => {
        if (cls.id === classId) {
          const updatedModules = cls.modules.map((m) =>
            m.id === moduleId ? { ...m, completed: !m.completed } : m
          );
          return { ...cls, modules: updatedModules };
        }
        return cls;
      })
    );
  };

  const enrollInClass = (classId: string) => {
    setVirtualClasses((prev) =>
      prev.map((cls) => (cls.id === classId ? { ...cls, isEnrolled: true, studentsCount: cls.studentsCount + 1 } : cls))
    );
    addNotification('Inscripción Exitosa', '¡Bienvenida a la clase virtual! Ya tienes acceso inmediato al contenido.', 'system');
  };

  // Inventory & Product Management
  const addProduct = (newProdData: Omit<Product, 'id' | 'salesCount' | 'rating' | 'reviewCount'>) => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...newProdData,
      id: newId,
      salesCount: 0,
      rating: 5.0,
      reviewCount: 0,
    };
    setProducts((prev) => [newProduct, ...prev]);
    addNotification('Producto Creado', `Se agregó "${newProduct.name}" al catálogo.`, 'system');
  };

  const updateProductStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p))
    );
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    addNotification('Producto Actualizado', `"${updated.name}" ha sido guardado.`, 'system');
  };

  const addSupplier = (supplierData: Omit<Supplier, 'id'>) => {
    const newSup: Supplier = {
      ...supplierData,
      id: `sup-${Date.now()}`,
    };
    setSuppliers((prev) => [...prev, newSup]);
    addNotification('Proveedor Registrado', `Se guardó a "${newSup.name}".`, 'system');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        loginAsCustomer,
        loginAsAdmin,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        activeTab,
        setActiveTab,
        products,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        onlyInStock,
        setOnlyInStock,
        selectedProduct,
        setSelectedProduct,
        quickViewProduct,
        favorites,
        toggleFavorite,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
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
        orders,
        createOrder,
        selectedOrderForProof,
        setSelectedOrderForProof,
        submitPaymentProof,
        verifyOrderPayment,
        rejectOrderPayment,
        updateOrderStatus,
        quotes,
        createQuoteRequest,
        adminQuotePrice,
        adminRejectQuote,
        customerAcceptQuote,
        reviews,
        selectedOrderForReview,
        setSelectedOrderForReview,
        submitReview,
        toggleReviewApproval,
        virtualClasses,
        toggleLessonCompleted,
        enrollInClass,
        addProduct,
        updateProductStock,
        updateProduct,
        suppliers,
        addSupplier,
        notifications,
        markNotificationAsRead,
        clearNotifications,
        isQuoteModalOpen,
        setIsQuoteModalOpen,
        checkoutSuccessOrder,
        setCheckoutSuccessOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
