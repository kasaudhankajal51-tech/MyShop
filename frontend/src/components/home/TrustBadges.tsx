import { Truck, Shield, RefreshCw, Headphones } from 'lucide-react';

const badges = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders above ₹999',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: '100% secure checkout',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description: '7 days return policy',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Dedicated support',
  },
];

export function TrustBadges() {
  return (
    <section className="py-10 border-b border-border/40 bg-background">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border/40 border-y border-border/40 bg-card/30 backdrop-blur-sm rounded-lg lg:rounded-full overflow-hidden shadow-sm">
          {badges.map((badge) => (
            <div
              key={badge.title}
              className="group flex flex-col md:flex-row items-center justify-center gap-4 p-6 transition-colors hover:bg-white/40"
            >
              <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                <badge.icon className="h-5 w-5 stroke-[1.5]" />
              </div>
              <div className="text-center md:text-left">
                <h4 className="font-bold text-xs tracking-widest uppercase mb-1 text-foreground">{badge.title}</h4>
                <p className="text-[10px] text-muted-foreground tracking-wide uppercase">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
