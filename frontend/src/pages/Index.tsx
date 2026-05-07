import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import DynamicBanners from '@/components/home/DynamicBanners';
import { DynamicCategories } from '@/components/home/DynamicCategories';
import { DynamicFeaturedProducts } from '@/components/home/DynamicFeaturedProducts';
import { DynamicNewArrivals } from '@/components/home/DynamicNewArrivals';
import { DynamicBestSellers } from '@/components/home/DynamicBestSellers';
import { PromoCarousel } from '@/components/home/PromoCarousel';
import { TrendingProducts } from '@/components/home/TrendingProducts';
import { FlashDeals } from '@/components/home/FlashDeals';
import { TrustBadges } from '@/components/home/TrustBadges';
import { Lookbook } from '@/components/home/Lookbook';
import { RecentlyViewed } from '@/components/home/RecentlyViewed';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Removed auto-redirect for wholesale users to allow them to browse retail site.
  // Users can navigate to wholesale dashboard via the Header link.
  /*
  useEffect(() => {
    if (user && user.role !== 'admin' && user.wholesaleProfile?.approvalStatus === 'approved') {
      navigate('/wholesale/dashboard');
    }
  }, [user, navigate]);
  */

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />
      <main>
        <DynamicBanners />
        <TrustBadges />
        <DynamicCategories />
        <FlashDeals />
        <DynamicFeaturedProducts />
        <TrendingProducts />
        <DynamicNewArrivals />
        <PromoCarousel />
        <Lookbook />
        <RecentlyViewed />
        <DynamicBestSellers />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
