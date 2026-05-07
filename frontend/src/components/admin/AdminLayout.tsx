import { ReactNode, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';
import { AdminSidebar } from './AdminSidebar';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [collapsed, setCollapsed] = useState(false);

  if (authLoading || adminLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    const redirect = encodeURIComponent(location.pathname + location.search + location.hash);
    return <Navigate to={`/auth?redirect=${redirect}`} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You don't have permission to access the admin panel.</p>
          <a href="/" className="text-accent hover:underline">Go back to store</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <main 
        className={cn(
            "transition-all duration-300 min-h-screen flex flex-col",
            collapsed ? "ml-20" : "ml-72"
        )}
      >
        {/* Top Header */}
        <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-30 px-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Admin</span>
                <span>/</span>
                <span className="capitalize">{location.pathname.split('/').pop() || 'Dashboard'}</span>
            </div>

            <div className="flex items-center gap-4">
                 <div className="text-xs text-muted-foreground hidden sm:block">
                    {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                 </div>
            </div>
        </header>

        <div className="p-6 flex-1">
             {children}
        </div>
      </main>
    </div>
  );
}
