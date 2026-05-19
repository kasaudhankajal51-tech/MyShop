import { Link } from 'react-router-dom';
import { Sun, Snowflake, ArrowUpRight, Users, Sparkles, TrendingUp, Crown, Loader2 } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';

// Default categories if database is empty
const defaultCategories = [
  {
    id: 'summer',
    title: 'Summer Collection',
    subtitle: 'Light & Breezy',
    description: 'Embrace the warmth with our curated summer essentials',
    icon: Sun,
    href: '/products?season=summer',
    gradient: 'from-primary/80 via-primary/60 to-accent/60',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 'winter',
    title: 'Winter Collection',
    subtitle: 'Cozy & Elegant',
    description: 'Stay warm in style with luxurious winter pieces',
    icon: Snowflake,
    href: '/products?season=winter',
    gradient: 'from-slate-800 via-slate-700 to-slate-600',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1000',
  },
];

const quickLinks = [
  { title: 'Women', href: '/products?category=women', icon: Users, gradient: 'from-primary to-tertiary' },
  { title: 'Men', href: '/products?category=men', icon: Users, gradient: 'from-teal to-emerald' },
  { title: 'New Arrivals', href: '/products?new=true', icon: Sparkles, gradient: 'from-accent to-primary' },
  { title: 'Best Sellers', href: '/products?bestseller=true', icon: TrendingUp, gradient: 'from-coral to-rose' },
];

export function DynamicCategories() {
  const { data: dbCategories, isLoading } = useCategories();

  // Use database categories if available, otherwise use defaults
      const categories = dbCategories && dbCategories.length > 0
    ? dbCategories.map((cat, index) => ({
        id: cat._id,
        title: cat.name,
        subtitle: cat.description?.slice(0, 20) || 'Explore Now',
        description: cat.description || `Discover our ${cat.name} collection`,
        icon: index % 2 === 0 ? Sun : Snowflake,
        href: `/products?category=${cat.slug}`,
        gradient: index % 3 === 0 
          ? 'from-primary/95 via-primary/85 to-secondary/75' 
          : index % 3 === 1 
            ? 'from-accent/95 via-accent/85 to-secondary/75' 
            : 'from-slate-900 via-slate-800 to-secondary/75',
        image: cat.image,
      }))
    : defaultCategories;

  return (
    <section className="py-24 bg-background">
      <div className="container">
        <div className="flex flex-col items-center mb-16 text-center">
            <h2 className="text-xs md:text-sm font-semibold uppercase text-secondary mb-2">Curated Selections</h2>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Shop By Category</h3>
            <div className="h-0.5 w-16 bg-primary/20 mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={category.href}
                className={`group relative overflow-hidden aspect-[4/3] md:aspect-[16/9] rounded-2xl border border-border/50 shadow-sm hover:shadow-xl transition-all duration-500 bg-gradient-to-br ${category.gradient}`}
              >
                 {category.image && (
                    <img 
                        src={category.image} 
                        alt={category.title} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                 )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent transition-all duration-500" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex items-end justify-between z-10">
                  <div className="space-y-1 text-left">
                    <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                      {category.subtitle || 'Explore Now'}
                    </p>
                    <h3 className="text-xl md:text-2xl text-white font-bold tracking-wide">
                      {category.title}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-primary group-hover:border-primary transition-all duration-300 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>
              </Link>
            ))}
        </div>

        {/* Featured Quick links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          {quickLinks.map((item) => (
            <Link
              key={item.title}
              to={item.href}
              className="group relative flex flex-col items-center p-8 bg-card rounded-2xl border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center mb-4 group-hover:bg-primary transition-all duration-300">
                <item.icon className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
              </div>
              <span className="text-xs font-semibold tracking-wider uppercase text-foreground group-hover:text-primary transition-colors text-center">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
