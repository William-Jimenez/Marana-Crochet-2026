import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { PaymentProofModal } from './components/PaymentProofModal';
import { ReviewModal } from './components/ReviewModal';
import { CustomQuoteModal } from './components/CustomQuoteModal';
import { AuthModal } from './components/AuthModal';

import { CatalogView } from './views/CatalogView';
import { CustomerOrdersView } from './views/CustomerOrdersView';
import { CustomerFavoritesView } from './views/CustomerFavoritesView';
import { CustomQuotesView } from './views/CustomQuotesView';
import { VirtualClassesView } from './views/VirtualClassesView';
import { AdminDashboardView } from './views/AdminDashboardView';

const MainLayout: React.FC = () => {
  const { activeTab, role } = useApp();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-800">
      <Navbar />

      <main className="flex-1">
        {activeTab === 'catalog' && <CatalogView />}
        {activeTab === 'orders' && <CustomerOrdersView />}
        {activeTab === 'favorites' && <CustomerFavoritesView />}
        {activeTab === 'quotes' && <CustomQuotesView />}
        {activeTab === 'classes' && <VirtualClassesView />}
        {activeTab === 'admin' && <AdminDashboardView />}
      </main>

      <Footer />

      {/* Global Interactive Modals */}
      <ProductDetailModal />
      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
      <OrderSuccessModal />
      <PaymentProofModal />
      <ReviewModal />
      <CustomQuoteModal />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
