import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Tags, 
  Image,
  ImagePlay,
  Zap,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  Store,
  User as UserIcon,
  MessageSquare,
  Shirt
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Separator } from '@/components/ui/separator';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Package, label: 'Products', path: '/admin/products' },
  { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
  { icon: Tags, label: 'Categories', path: '/admin/categories' },
  { icon: Users, label: 'Customers', path: '/admin/customers' },
  { icon: Image, label: 'Banners', path: '/admin/banners' },
  { icon: ImagePlay, label: 'Carousel', path: '/admin/carousel' },
  { icon: Zap, label: 'Flash Deals', path: '/admin/flash-deals' },
  { icon: Shirt, label: 'Shop The Look', path: '/admin/lookbook' },
  // Wholesale items removed
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function AdminSidebar({ collapsed, setCollapsed }: AdminSidebarProps) {
  const location = useLocation();
  const { user, signOut } = useAuth();

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 flex flex-col shadow-xl",
        collapsed ? "w-20" : "w-72"
      )}
    >
        {/* Header with Gradient */}
        <div className="flex h-16 items-center flex-shrink-0 justify-between px-4 bg-gradient-to-r from-primary/10 to-transparent border-b border-border/50">
          {!collapsed && (
            <div className="flex flex-col animate-in fade-in duration-300">
                 <Link to="/admin" className="font-display text-lg font-bold text-foreground truncate">
                  JSB Admin
                </Link>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Control Panel</span>
            </div>
           
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
          >
            {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-6 p-4 overflow-y-auto custom-scrollbar">
          
          {/* Retail Section */}
          <div>
            <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Retail Store
            </div>
            <div className="space-y-1">
              {menuItems.filter(item => !item.path.includes('/wholesale') && item.label !== 'Settings' && item.label !== 'Quotes').map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path !== '/admin' && location.pathname.startsWith(item.path));
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                      collapsed && "justify-center px-2"
                    )}
                  >
                    {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-20" />
                    )}
                    <item.icon className={cn("h-5 w-5 flex-shrink-0 transition-transform duration-200", isActive ? "scale-110" : "group-hover:scale-110")} />
                    {!collapsed && <span className="animate-in fade-in slide-in-from-left-2 duration-200">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>

          <Separator className="bg-border/50" />

           {/* Settings Section */}
           <div>
            <div className="space-y-1">
              {menuItems.filter(item => item.label === 'Settings').map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                      isActive 
                        ? "bg-secondary text-foreground" 
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                      collapsed && "justify-center px-2"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5 flex-shrink-0 transition-transform duration-200", isActive ? "scale-110" : "group-hover:scale-110")} />
                    {!collapsed && <span className="animate-in fade-in slide-in-from-left-2 duration-200">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t border-border mt-auto bg-muted/30">
             {/* Back to Store */}
            <Link
                to="/"
                className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-background hover:text-primary hover:shadow-sm transition-all mb-2",
                collapsed && "justify-center px-2"
                )}
            >
                <Store className="h-4 w-4" />
                {!collapsed && <span className="animate-in fade-in duration-200">Visit Store</span>}
            </Link>

            <Separator className="my-2 bg-border/50" />

            {/* User Profile & Logout */}
            <div className={cn("flex items-center gap-3", collapsed ? "flex-col" : "justify-between")}>
                {!collapsed && (
                    <div className="flex items-center gap-3 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-sm ring-2 ring-background">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="flex flex-col truncate">
                            <span className="text-sm font-medium truncate text-foreground">{user?.name || 'Admin'}</span>
                            <span className="text-xs text-muted-foreground truncate">{user?.email || 'admin@jsb.com'}</span>
                        </div>
                    </div>
                )}
                
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                        localStorage.removeItem('adminMode');
                        signOut();
                    }}
                    className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                    title="Sign Out"
                >
                    <LogOut className="h-4 w-4" />
                </Button>
            </div>
        </div>
    </aside>
  );
}
