import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { ShieldCheck, Zap, Sparkles, Award } from 'lucide-react';

export default function Quality() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />
      
      <main className="pb-24">
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[300px] flex items-center justify-center overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=2000" 
            alt="Quality Commitment" 
            className="absolute inset-0 w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="container relative z-20 text-center text-white">
            <span className="text-xs md:text-sm font-bold tracking-[0.5em] uppercase mb-4 block animate-fade-in-up">The Standard</span>
            <h1 className="text-5xl md:text-7xl font-display font-medium tracking-tighter italic animate-fade-in-up [animation-delay:200ms]">
              QUALITY <span className="not-italic font-bold">ASSURANCE</span>
            </h1>
          </div>
        </section>

        {/* Quality Pillars */}
        <section className="py-32 container">
          <div className="flex flex-col items-center text-center mb-24">
            <h2 className="text-sm font-bold tracking-[0.6em] uppercase text-secondary mb-6">Our Four Pillars</h2>
            <div className="h-px w-20 bg-primary/20" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              {
                icon: ShieldCheck,
                title: 'Premium Fabrics',
                description: 'We source only high-grade silk, cotton, and wool from certified weavers across India.',
              },
              {
                icon: Zap,
                title: 'Precision Weaving',
                description: 'Advanced weaving techniques ensure durability and a flawless finish in every garment.',
              },
              {
                icon: Sparkles,
                title: 'Intricate Detail',
                description: 'Every sequin, thread, and motif is inspected for perfect alignment and craftsmanship.',
              },
              {
                icon: Award,
                title: 'Certified Origin',
                description: 'We guarantee the authenticity of regional specialities like Banarasi and Lucknowi weaves.',
              },
            ].map((pillar) => (
              <div key={pillar.title} className="group p-8 border border-border/40 hover:border-primary/20 transition-all duration-500 bg-card/30 backdrop-blur-sm">
                <div className="mb-6 p-4 bg-primary/5 w-fit rounded-full text-primary group-hover:scale-110 transition-transform duration-500">
                    <pillar.icon className="h-6 w-6" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-4 group-hover:text-primary transition-colors">{pillar.title}</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed uppercase tracking-tight">{pillar.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Detailed Inspection Process */}
        <section className="py-24 bg-secondary/5">
            <div className="container">
                <div className="grid md:grid-cols-2 gap-20 items-center">
                    <div className="order-2 md:order-1">
                         <div className="aspect-[4/5] overflow-hidden shadow-2xl relative">
                            <img 
                                src="https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&q=80&w=1000" 
                                className="w-full h-full object-cover"
                                alt="Fabric Inspection"
                            />
                            <div className="absolute inset-0 border-[20px] border-white/10 m-8" />
                         </div>
                    </div>
                    <div className="order-1 md:order-2 space-y-10">
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold tracking-[0.4em] uppercase text-secondary">The Process</h3>
                            <h4 className="text-4xl font-display italic">Meticulous <span className="not-italic font-bold">INSPECTION</span></h4>
                        </div>
                        
                        <div className="space-y-8">
                            {[
                                { step: '01', title: 'Fiber Selection', desc: 'Initial testing of yarn strength and dye absorption.' },
                                { step: '02', title: 'Weaving Audit', desc: 'Continuous monitoring of loom tension and pattern accuracy.' },
                                { step: '03', title: 'Final Finishing', desc: 'Hand-finishing of all borders, buttons, and decorative elements.' },
                                { step: '04', title: 'Purity Check', desc: 'Certification of silver/gold zari and natural dyes.' },
                            ].map((item) => (
                                <div key={item.step} className="flex gap-6">
                                    <span className="text-2xl font-display font-bold text-primary/40">{item.step}</span>
                                    <div className="space-y-1">
                                        <h5 className="text-[11px] font-bold uppercase tracking-widest">{item.title}</h5>
                                        <p className="text-[10px] text-muted-foreground uppercase">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
