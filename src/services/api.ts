/**
 * Maraña Crochet - Servicio de Integración con Backend PHP & MySQL (XAMPP)
 */

import { Product, Order, CustomQuoteRequest, Review, Supplier, VirtualClass, Coupon, User } from '../types';

// La URL base puede configurarse mediante VITE_API_URL o usar el proxy /api de Vite hacia PHP
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Cliente HTTP para realizar peticiones al API PHP
 */
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `Error HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export const apiService = {
  // 1. Estado y Diagnóstico de la Base de Datos
  async getStatus(): Promise<{
    success: boolean;
    connected: boolean;
    engine: string;
    version: string;
    database: string;
    host: string;
    stats: { products: number; orders: number; quotes: number; reviews: number };
  }> {
    return request('/status.php');
  },

  // 2. Productos & Inventario
  async getProducts(): Promise<{ success: boolean; data: Product[] }> {
    return request('/products.php');
  },

  async createProduct(product: Omit<Product, 'id' | 'salesCount' | 'rating' | 'reviewCount'>): Promise<{ success: boolean; data: Product }> {
    return request('/products.php', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  async updateProductStock(id: string, stock: number): Promise<{ success: boolean }> {
    return request('/products.php', {
      method: 'PUT',
      body: JSON.stringify({ action: 'update_stock', id, stock }),
    });
  },

  async updateProduct(product: Product): Promise<{ success: boolean }> {
    return request('/products.php', {
      method: 'PUT',
      body: JSON.stringify({ action: 'update_all', ...product }),
    });
  },

  // 3. Pedidos & Comprobantes
  async getOrders(): Promise<{ success: boolean; data: Order[] }> {
    return request('/orders.php');
  },

  async createOrder(order: Partial<Order>): Promise<{ success: boolean; orderId: string }> {
    return request('/orders.php', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  },

  async submitPaymentProof(orderId: string, proof: { bankName: string; receiptNumber?: string; imageUrl?: string }): Promise<{ success: boolean }> {
    return request('/orders.php', {
      method: 'PUT',
      body: JSON.stringify({ action: 'submit_proof', orderId, proof }),
    });
  },

  async verifyPayment(orderId: string): Promise<{ success: boolean }> {
    return request('/orders.php', {
      method: 'PUT',
      body: JSON.stringify({ action: 'verify_payment', orderId }),
    });
  },

  async rejectPayment(orderId: string, reason: string): Promise<{ success: boolean }> {
    return request('/orders.php', {
      method: 'PUT',
      body: JSON.stringify({ action: 'reject_payment', orderId, reason }),
    });
  },

  async updateOrderStatus(orderId: string, status: Order['orderStatus']): Promise<{ success: boolean }> {
    return request('/orders.php', {
      method: 'PUT',
      body: JSON.stringify({ action: 'update_status', orderId, status }),
    });
  },

  // 4. Cotizaciones Personalizadas (HU-35)
  async getQuotes(): Promise<{ success: boolean; data: CustomQuoteRequest[] }> {
    return request('/quotes.php');
  },

  async createQuote(quote: Partial<CustomQuoteRequest>): Promise<{ success: boolean; quoteId: string }> {
    return request('/quotes.php', {
      method: 'POST',
      body: JSON.stringify(quote),
    });
  },

  async adminQuotePrice(quoteId: string, price: number, estimatedDays: number, adminNote?: string): Promise<{ success: boolean }> {
    return request('/quotes.php', {
      method: 'PUT',
      body: JSON.stringify({ action: 'quote_price', quoteId, price, estimatedDays, adminNote }),
    });
  },

  async adminRejectQuote(quoteId: string, adminNote: string): Promise<{ success: boolean }> {
    return request('/quotes.php', {
      method: 'PUT',
      body: JSON.stringify({ action: 'reject', quoteId, adminNote }),
    });
  },

  async customerAcceptQuote(quoteId: string): Promise<{ success: boolean }> {
    return request('/quotes.php', {
      method: 'PUT',
      body: JSON.stringify({ action: 'accept', quoteId }),
    });
  },

  // 5. Reseñas
  async getReviews(): Promise<{ success: boolean; data: Review[] }> {
    return request('/reviews.php');
  },

  async submitReview(review: { productId: string; orderId?: string; rating: number; comment: string; customerName?: string; productName?: string }): Promise<{ success: boolean; reviewId: string }> {
    return request('/reviews.php', {
      method: 'POST',
      body: JSON.stringify(review),
    });
  },

  async toggleReviewApproval(reviewId: string): Promise<{ success: boolean }> {
    return request('/reviews.php', {
      method: 'PUT',
      body: JSON.stringify({ reviewId }),
    });
  },

  // 6. Proveedores
  async getSuppliers(): Promise<{ success: boolean; data: Supplier[] }> {
    return request('/suppliers.php');
  },

  async createSupplier(supplier: Omit<Supplier, 'id'>): Promise<{ success: boolean; data: Supplier }> {
    return request('/suppliers.php', {
      method: 'POST',
      body: JSON.stringify(supplier),
    });
  },

  // 7. Clases Virtuales
  async getClasses(): Promise<{ success: boolean; data: VirtualClass[] }> {
    return request('/classes.php');
  },

  async enrollInClass(classId: string): Promise<{ success: boolean }> {
    return request('/classes.php', {
      method: 'PUT',
      body: JSON.stringify({ action: 'enroll', classId }),
    });
  },

  async toggleLessonModule(classId: string, moduleId: string): Promise<{ success: boolean }> {
    return request('/classes.php', {
      method: 'PUT',
      body: JSON.stringify({ action: 'toggle_module', classId, moduleId }),
    });
  },

  // 8. Cupones
  async getCoupons(): Promise<{ success: boolean; data: Coupon[] }> {
    return request('/coupons.php');
  },

  async validateCoupon(code: string): Promise<{ success: boolean; data: Coupon }> {
    return request('/coupons.php', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  },

  // 9. Autenticación
  async login(email: string, password?: string): Promise<{ success: boolean; user: User }> {
    return request('/auth.php?action=login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(userData: { name: string; email: string; password?: string; phone?: string; address?: string; city?: string }): Promise<{ success: boolean; user: User }> {
    return request('/auth.php?action=register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};
