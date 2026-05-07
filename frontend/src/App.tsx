
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ShoppingModeProvider } from "@/context/ShoppingModeContext";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";

import AuthSuccess from "./pages/AuthSuccess";
import Account from "./pages/Account";
import OrderDetails from "./pages/OrderDetails";
import Wishlist from "./pages/Wishlist";
import NotFound from "./pages/NotFound";

import Contact from "./pages/info/Contact";
import TrackOrder from "./pages/info/TrackOrder";
import PrivacyPolicy from "./pages/info/Privacy";
import TermsOfService from "./pages/info/Terms";
import Shipping from "./pages/info/Shipping";
import Returns from "./pages/info/Returns";
import FAQ from "./pages/info/FAQ";
import SizeGuide from "./pages/info/SizeGuide";
import About from "./pages/info/About";
import Heritage from "./pages/info/Heritage";
import Quality from "./pages/info/Quality";

// Admin Pages
import { AdminRoute } from "@/components/auth/AdminRoute";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminCategories from "./pages/admin/Categories";
import AdminCustomers from "./pages/admin/Customers";
import AdminBanners from "./pages/admin/Banners";
import AdminCarousel from "./pages/admin/Carousel";
import AdminFlashDeals from "./pages/admin/FlashDeals";
import AdminSettings from "./pages/admin/Settings";
import AdminQuotes from "./pages/admin/Quotes";
import AdminLookbook from "./pages/admin/Lookbook";
import LookbookEditor from "./pages/admin/LookbookEditor";
import { ChatBot } from "./components/support/ChatBot";

// Wholesale Pages removed

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light" storageKey="jsb-theme">
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ShoppingModeProvider>
          <CartProvider>
            <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/success" element={<AuthSuccess />} />
                <Route path="/account" element={<Account />} />
                <Route path="/order/:id" element={<OrderDetails />} />
                <Route path="/wishlist" element={<Wishlist />} />
                
                {/* Info Pages */}
                <Route path="/contact" element={<Contact />} />
                <Route path="/track-order" element={<TrackOrder />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/returns" element={<Returns />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/size-guide" element={<SizeGuide />} />
                <Route path="/about" element={<About />} />
                <Route path="/heritage" element={<Heritage />} />
                <Route path="/quality" element={<Quality />} />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
                <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
                <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
                <Route path="/admin/customers" element={<AdminRoute><AdminCustomers /></AdminRoute>} />
                <Route path="/admin/banners" element={<AdminRoute><AdminBanners /></AdminRoute>} />
                <Route path="/admin/carousel" element={<AdminRoute><AdminCarousel /></AdminRoute>} />
              <Route path="/admin/flash-deals" element={<AdminRoute><AdminFlashDeals /></AdminRoute>} />
              <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
              <Route path="/admin/lookbook" element={<AdminRoute><AdminLookbook /></AdminRoute>} />
              <Route path="/admin/lookbook/create" element={<AdminRoute><LookbookEditor /></AdminRoute>} />
              <Route path="/admin/lookbook/edit/:id" element={<AdminRoute><LookbookEditor /></AdminRoute>} />
              
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <ChatBot />
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </ShoppingModeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
