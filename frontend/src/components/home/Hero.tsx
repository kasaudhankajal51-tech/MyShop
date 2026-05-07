import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sun, Snowflake, Sparkles, Star } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal via-primary to-emerald" />
      
      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 right-10 w-80 h-80 bg-coral/25 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-32 left-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-primary-foreground/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-primary-foreground">
            {/* Brand badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-foreground/10 backdrop-blur-md rounded-full mb-8 animate-fade-in border border-primary-foreground/20">
              <Star className="h-4 w-4 text-coral fill-coral" />
              <span className="text-xs tracking-[0.25em] font-semibold">PREMIUM FASHION STORE</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] mb-6 animate-slide-up">
              <span className="text-coral">Jai Shree</span>
              <br />
              <span className="text-primary-foreground">Balaji</span>
              <br />
              <span className="text-accent italic text-4xl md:text-5xl lg:text-6xl">Original Fashion</span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/85 max-w-lg mb-10 animate-slide-up leading-relaxed font-light" style={{ animationDelay: '0.2s' }}>
              Discover premium readymade clothing for the entire family. 
              Quality fabrics, trendy designs, and unbeatable prices.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Button size="xl" className="bg-coral text-white hover:bg-coral/90 shadow-lg shadow-coral/30 group font-semibold" asChild>
                <Link to="/products?season=summer">
                  <Sun className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-500" />
                  Summer Collection
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" className="border-2 border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 backdrop-blur-sm group font-semibold" asChild>
                <Link to="/products?season=winter">
                  <Snowflake className="mr-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                  Winter Collection
                </Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-8 mt-14 pt-8 border-t border-primary-foreground/20 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-display font-bold text-coral">10K+</p>
                <p className="text-xs text-primary-foreground/70 tracking-wider mt-1">Happy Customers</p>
              </div>
              <div className="w-px h-12 bg-primary-foreground/25" />
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-display font-bold text-coral">500+</p>
                <p className="text-xs text-primary-foreground/70 tracking-wider mt-1">Products</p>
              </div>
              <div className="w-px h-12 bg-primary-foreground/25" />
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-display font-bold text-coral">4.9★</p>
                <p className="text-xs text-primary-foreground/70 tracking-wider mt-1">Rating</p>
              </div>
            </div>
          </div>

          {/* Visual Cards */}
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-6">
              {/* Summer Card */}
              <Link 
                to="/products?season=summer"
                className="group relative h-72 rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-tertiary to-accent shadow-2xl hover:shadow-primary/30 transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] animate-fade-in"
                style={{ animationDelay: '0.3s' }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Sun className="h-6 w-6 text-white group-hover:rotate-180 transition-transform duration-700" />
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-xs text-white/80 tracking-[0.3em] mb-2 font-semibold">COLLECTION</p>
                  <h3 className="text-3xl font-display font-bold text-white">Summer</h3>
                  <p className="text-sm text-white/70 mt-2">Light & Breezy</p>
                </div>
              </Link>
              
              {/* Winter Card */}
              <Link 
                to="/products?season=winter"
                className="group relative h-72 rounded-3xl overflow-hidden bg-gradient-to-br from-navy via-primary to-accent shadow-2xl hover:shadow-navy/30 transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] mt-12 animate-fade-in"
                style={{ animationDelay: '0.4s' }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Snowflake className="h-6 w-6 text-white group-hover:rotate-180 transition-transform duration-700" />
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-xs text-white/80 tracking-[0.3em] mb-2 font-semibold">COLLECTION</p>
                  <h3 className="text-3xl font-display font-bold text-white">Winter</h3>
                  <p className="text-sm text-white/70 mt-2">Warm & Cozy</p>
                </div>
              </Link>
              
              {/* Women Card */}
              <Link 
                to="/products?category=women"
                className="group relative h-52 rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-accent to-tertiary shadow-2xl hover:shadow-primary/30 transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] -mt-6 animate-fade-in"
                style={{ animationDelay: '0.5s' }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-xs text-white/80 tracking-[0.3em] mb-1.5 font-semibold">SHOP</p>
                  <h3 className="text-2xl font-display font-bold text-white">Women</h3>
                </div>
              </Link>
              
              {/* Men Card */}
              <Link 
                to="/products?category=men"
                className="group relative h-52 rounded-3xl overflow-hidden bg-gradient-to-br from-teal via-emerald to-navy shadow-2xl hover:shadow-teal/30 transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] animate-fade-in"
                style={{ animationDelay: '0.6s' }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-xs text-white/80 tracking-[0.3em] mb-1.5 font-semibold">SHOP</p>
                  <h3 className="text-2xl font-display font-bold text-white">Men</h3>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-8 h-14 border-2 border-primary-foreground/40 rounded-full flex justify-center pt-3">
          <div className="w-2 h-4 bg-coral rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
