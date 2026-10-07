export type UserRole = 'visitor' | 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  city?: string;
  avatarUrl?: string;
}

export type ProductCategory = 'amigurumis' | 'prendas' | 'accesorios' | 'kits_patrones';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  stock: number;
  minStockAlert: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  description: string;
  details: string[];
  isFeatured: boolean;
  salesCount: number;
  sku: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  product: Product;
}

export type PaymentMethod = 'transfer' | 'cash';
export type PaymentStatus = 'pending_verification' | 'verified' | 'rejected';
export type OrderStatus = 'pending' | 'in_preparation' | 'shipped' | 'delivered' | 'cancelled';

export interface PaymentProof {
  receiptNumber?: string;
  bankName: string; // 'Bancolombia' | 'Nequi' | 'Daviplata' | 'Efectivo'
  imageUrl?: string;
  submittedAt: string;
  rejectedReason?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  imageUrl: string;
}

export interface Order {
  id: string; // e.g. MAR-2026-1042
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    address: string;
    city: string;
    notes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingCost: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentProof?: PaymentProof;
  isReviewed?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type QuoteStatus = 'pending' | 'quoted' | 'accepted' | 'rejected';

export interface CustomQuoteRequest {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  itemType: string;
  description: string;
  dimensions: string;
  preferredColors: string;
  referenceImage?: string;
  status: QuoteStatus;
  quotedPrice?: number;
  estimatedDays?: number;
  adminNote?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  orderId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  isApproved: boolean;
}

export interface VirtualClass {
  id: string;
  title: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
  duration: string;
  lessonsCount: number;
  instructor: string;
  imageUrl: string;
  description: string;
  modules: { id: string; title: string; duration: string; completed: boolean }[];
  rating: number;
  studentsCount: number;
  isEnrolled?: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  category: string;
  leadTimeDays: number;
  lastRestockDate: string;
  notes: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minPurchase: number;
  description: string;
  isActive: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'order' | 'quote' | 'payment' | 'system';
  orderId?: string;
}
