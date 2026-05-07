import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { Sparkles, Heart, Users, Target } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />
      
      <main className="pb-24">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000" 
            alt="About Balaji Textiles" 
            className="absolute inset-0 w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="container relative z-20 text-center text-white">
            <span className="text-xs md:text-sm font-bold tracking-[0.5em] uppercase mb-4 block animate-fade-in-up">Our Journey</span>
            <h1 className="text-5xl md:text-8xl font-display font-medium tracking-tighter italic animate-fade-in-up [animation-delay:200ms]">
              ABOUT <span className="not-italic font-bold">US</span>
            </h1>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-32 container">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-secondary">The Philosophy</h2>
                <h3 className="text-4xl md:text-5xl font-display font-medium tracking-tight italic">Elegance in every <span className="not-italic font-bold">STITCH</span></h3>
                <div className="h-px w-20 bg-primary/20" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                Balaji Textiles was founded with a singular vision: to bring the richness of Indian heritage to the modern wardrobe. We believe that clothing is not just about attire, but a celebration of culture, craftsmanship, and individuality.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-8">
                <div className="space-y-3">
                  <Heart className="h-6 w-6 text-primary" />
                  <h4 className="text-[11px] font-bold uppercase tracking-widest">Passion Driven</h4>
                  <p className="text-[10px] text-muted-foreground leading-relaxed uppercase">Every piece is selected with heart and soul.</p>
                </div>
                <div className="space-y-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <h4 className="text-[11px] font-bold uppercase tracking-widest">Curated Quality</h4>
                  <p className="text-[10px] text-muted-foreground leading-relaxed uppercase">Only the finest fabrics make it to our store.</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-secondary/10 overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1558273109-8077bc87771e?auto=format&fit=crop&q=80&w=1000" 
                  alt="Craftsmanship" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-24 bg-secondary/5 border-y border-border/40">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {[
                { label: 'Years of Heritage', value: '25+' },
                { label: 'Happy Customers', value: '10k+' },
                { label: 'Artisan Partners', value: '100+' },
                { label: 'Store Collections', value: '500+' },
              ].map((stat) => (
                <div key={stat.label} className="text-center space-y-2">
                  <p className="text-4xl md:text-5xl font-display font-bold text-primary italic">{stat.value}</p>
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
