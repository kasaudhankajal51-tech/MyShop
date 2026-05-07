import { Link } from 'react-router-dom';
import { Sun, Snowflake, ArrowUpRight, Users, Award, Sparkles, TrendingUp } from 'lucide-react';

const categories = [
  {
    id: 'summer',
    title: 'Summer Collection',
    subtitle: 'Light & Breezy',
    description: 'Embrace the warmth with our curated summer essentials',
    icon: Sun,
    href: '/products?season=summer',
    gradient: 'from-summer via-saffron to-summer/80',
    bgClass: 'bg-gradient-to-br from-summer-light to-cream',
    iconBg: 'bg-gradient-to-br from-summer to-saffron',
  },
  {
    id: 'winter',
    title: 'Winter Collection',
    subtitle: 'Cozy & Elegant',
    description: 'Stay warm in style with luxurious winter pieces',
    icon: Snowflake,
    href: '/products?season=winter',
    gradient: 'from-winter via-navy to-winter/80',
    bgClass: 'bg-gradient-to-br from-winter-light to-background',
    iconBg: 'bg-gradient-to-br from-winter to-navy',
  },
];

const quickLinks = [
  { title: 'Women', href: '/products?category=women', icon: Users, color: 'group-hover:text-primary' },
  { title: 'Men', href: '/products?category=men', icon: Users, color: 'group-hover:text-navy' },
  { title: 'New Arrivals', href: '/products?new=true', icon: Sparkles, color: 'group-hover:text-accent' },
  { title: 'Best Sellers', href: '/products?bestseller=true', icon: TrendingUp, color: 'group-hover:text-emerald' },
];

export function Categories() {
  return (
    <section className="py-24 bg-secondary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-4">
            <Award className="h-4 w-4 text-accent" />
            <span className="text-xs font-medium tracking-wider text-accent">SHOP BY SEASON</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold">
            Seasonal <span className="text-gradient">Collections</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={category.href}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-elegant transition-all duration-500 animate-slide-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className={`${category.bgClass} p-8 md:p-12 min-h-[420px] flex flex-col justify-between transition-transform duration-500 group-hover:scale-[1.02]`}>
                {/* Icon */}
                <div className={`w-20 h-20 rounded-2xl ${category.iconBg} flex items-center justify-center text-primary-foreground shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <category.icon className="h-10 w-10" />
                </div>

                {/* Content */}
                <div>
                  <p className="text-sm font-medium tracking-widest text-muted-foreground mb-2 uppercase">
                    {category.subtitle}
                  </p>
                  <h3 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">
                    {category.title}
                  </h3>
                  <p className="text-muted-foreground max-w-sm leading-relaxed">
                    {category.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="absolute bottom-8 right-8 w-14 h-14 rounded-full bg-foreground text-background flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-45 group-hover:bg-accent group-hover:text-accent-foreground shadow-lg">
                  <ArrowUpRight className="h-6 w-6" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {quickLinks.map((item, index) => (
            <Link
              key={item.title}
              to={item.href}
              className="group relative bg-card p-6 md:p-8 text-center rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm hover:shadow-lg animate-slide-up overflow-hidden"
              style={{ animationDelay: `${(index + 2) * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/10 group-hover:to-transparent transition-all duration-500" />
              <item.icon className={`h-6 w-6 mx-auto mb-3 text-muted-foreground group-hover:text-primary-foreground transition-colors ${item.color}`} />
              <span className="text-sm font-medium tracking-wider relative z-10">{item.title.toUpperCase()}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}