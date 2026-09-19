import React from 'react';
import { FoodProvider } from './context/FoodContext';
import { TopSlideBar } from './components/TopSlideBar';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoriesSection } from './components/CategoriesSection';
import { MenuSection } from './components/MenuSection';
import { FeaturedFoodSection } from './components/FeaturedFoodSection';
import { PopularCarousel } from './components/PopularCarousel';
import { DeliverySection } from './components/DeliverySection';
import { AboutSection } from './components/AboutSection';
import { ChefSection } from './components/ChefSection';
import { ReviewsSection } from './components/ReviewsSection';
import { OffersSection } from './components/OffersSection';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { FoodDetailModal } from './components/FoodDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { OrdersDrawer } from './components/OrdersDrawer';
import { ProductManagerModal } from './components/ProductManagerModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Toast } from './components/Toast';
import { CustomCursor } from './components/CustomCursor';

export default function App() {
  return (
    <FoodProvider>
      <div className="min-h-screen bg-[#07080B] text-neutral-100 flex flex-col selection:bg-amber-500 selection:text-black">
        {/* Custom ambient cursor */}
        <CustomCursor />

        {/* Animated Slide Bar at Top */}
        <TopSlideBar />

        {/* Global sticky navigation */}
        <Navbar />

        {/* Main page content sections */}
        <main className="flex-1">
          <HeroSection />
          <CategoriesSection />
          <MenuSection />
          <FeaturedFoodSection />
          <PopularCarousel />
          <DeliverySection />
          <AboutSection />
          <ChefSection />
          <ReviewsSection />
          <OffersSection />
          <NewsletterSection />
        </main>

        {/* Footer */}
        <Footer />

        {/* Overlays, Drawers & Modals */}
        <FoodDetailModal />
        <CartDrawer />
        <SearchModal />
        <OrderTrackingModal />
        <OrdersDrawer />
        <ProductManagerModal />
        <AdminDashboard />
        <Toast />
      </div>
    </FoodProvider>
  );
}
