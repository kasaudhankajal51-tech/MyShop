import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Gift, Sparkles, Mail, ArrowRight } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Welcome to Shree Balaji Textiles!",
        description: "You've been subscribed to our newsletter. Check your email for 10% off!",
      });
      setEmail('');
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-primary via-tertiary to-primary text-primary-foreground relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-primary-foreground/5 rounded-full blur-2xl" />
      
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent/20 backdrop-blur-sm rounded-full mb-6 animate-fade-in">
            <Gift className="h-5 w-5 text-accent" />
            <span className="text-sm font-medium tracking-wider">EXCLUSIVE OFFER</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 animate-slide-up">
            Get <span className="text-accent">10% Off</span>
            <br />
            Your First Order
          </h2>
          
          <p className="text-lg text-primary-foreground/80 mb-10 max-w-xl mx-auto animate-slide-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
            Subscribe to receive exclusive offers, early access to new collections, and styling tips delivered straight to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-foreground/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-12 pr-6 py-4 bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground placeholder:text-primary-foreground/50 outline-none focus:bg-primary-foreground/15 transition-all duration-300 rounded-xl border border-primary-foreground/10 focus:border-accent/50"
                required
              />
            </div>
            <Button type="submit" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow group rounded-xl px-8">
              Subscribe
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 pt-8 border-t border-primary-foreground/10 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2 text-primary-foreground/70">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm">No spam, ever</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/70">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm">Unsubscribe anytime</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/70">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm">Exclusive deals</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}