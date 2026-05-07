import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';

export default function Heritage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />
      
      <main className="pb-24">
        {/* Hero Section */}
        <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&q=80&w=2000" 
            alt="Our Heritage" 
            className="absolute inset-0 w-full h-full object-cover scale-105 animate-slow-zoom brightness-[0.7]"
          />
          <div className="container relative z-20 text-center text-white">
            <span className="text-xs md:text-sm font-bold tracking-[0.5em] uppercase mb-6 block animate-fade-in-up">The Legacy</span>
            <h1 className="text-6xl md:text-9xl font-display font-medium tracking-tighter italic animate-fade-in-up [animation-delay:200ms]">
              OUR <span className="not-italic font-bold">HERITAGE</span>
            </h1>
            <div className="h-px w-24 bg-primary/60 mx-auto mt-12 animate-scale-in [animation-delay:400ms]" />
          </div>
        </section>

        {/* Narrative Section */}
        <section className="py-32 container">
          <div className="max-w-4xl mx-auto space-y-20">
            <div className="text-center space-y-8">
              <h2 className="text-sm font-bold tracking-[0.6em] uppercase text-secondary">A Tradition of Excellence</h2>
              <p className="text-xl md:text-3xl font-display font-medium leading-relaxed italic text-foreground/80">
                "For generations, Balaji Textiles has been synonymous with quality and trust in the heart of Khalilabad. Our story is woven with threads of integrity, passion, and a commitment to preserving the art of Indian textiles."
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="space-y-6">
                    <h3 className="text-2xl font-display font-bold uppercase tracking-tight">The Beginning</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                        Started as a small local boutique, we have grown into a landmark destination for ethnic wear. Our founders believed that every customer deserves the royal treatment, regardless of the occasion.
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                        We pioneered the introduction of diverse regional weaves from across India to our local community, bridging the gap between traditional artisans and modern consumers.
                    </p>
                </div>
                <div className="aspect-[3/4] bg-secondary/5 overflow-hidden shadow-2xl">
                    <img 
                        src="https://images.unsplash.com/photo-1558273109-8077bc87771e?auto=format&fit=crop&q=80&w=1000" 
                        className="w-full h-full object-cover"
                        alt="Heritage Weaving"
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-center">
                 <div className="order-2 md:order-1 aspect-[4/5] bg-secondary/5 overflow-hidden shadow-2xl">
                    <img 
                        src="https://images.unsplash.com/photo-1610030469668-93510cb67335?auto=format&fit=crop&q=80&w=1000" 
                        className="w-full h-full object-cover"
                        alt="Vintage Store"
                    />
                </div>
                <div className="order-1 md:order-2 space-y-6">
                    <h3 className="text-2xl font-display font-bold uppercase tracking-tight">Evolution</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                        As times changed, so did we. Today, Balaji Textiles blends traditional expertise with modern retail technology, ensuring that our heritage reaches you wherever you are.
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                        Our collections now include everything from the most delicate handloom sarees to contemporary sherwanis, all curated with the same eye for detail that our founders possessed.
                    </p>
                </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
