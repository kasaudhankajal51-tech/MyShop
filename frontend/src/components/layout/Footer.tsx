import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone, Clock, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-background border-t border-border/40 text-foreground relative overflow-hidden pt-24 pb-12">
      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-20 mb-20">
          {/* Brand Identity */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
                <h2 className="text-3xl font-display font-medium uppercase tracking-[0.2em]">
                    BALAJI <span className="text-primary italic">TEXTILES</span>
                </h2>
                <div className="h-px w-12 bg-primary/40" />
                <p className="text-xs text-muted-foreground leading-relaxed max-w-sm tracking-wide font-medium">
                    Curating excellence in ethnic and readymade apparel since inception. We bring together timeless traditions and modern aesthetics for the discerning family.
                </p>
            </div>
            
            <div className="space-y-6">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary">The Newsletter</h4>
                <div className="flex flex-col gap-4 max-w-xs">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Sign up for exclusive collection previews.</p>
                    <div className="relative group">
                        <input 
                            type="email" 
                            placeholder="EMAIL ADDRESS" 
                            className="w-full bg-transparent border-b border-border/60 py-3 text-[10px] font-bold tracking-widest focus:outline-none focus:border-primary transition-all duration-500 uppercase"
                        />
                        <button className="absolute right-0 bottom-3 text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors">
                            Subscribe
                        </button>
                        <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-primary group-focus-within:w-full transition-all duration-700" />
                    </div>
                </div>
            </div>

            <div className="flex gap-8">
              {[
                { icon: Instagram, label: 'Instagram' },
                { icon: Facebook, label: 'Facebook' },
                { icon: Twitter, label: 'Twitter' },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-all duration-500 hover:-translate-y-1"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-8">
                <h3 className="text-[10px] font-bold tracking-[0.4em] uppercase text-secondary">Collections</h3>
                <ul className="space-y-4">
                {[
                    { label: 'The Summer Edit', href: '/products?season=summer' },
                    { label: 'Winter Luxury', href: '/products?season=winter' },
                    { label: 'Women\'s Ethnic', href: '/products?category=women' },
                    { label: 'Men\'s Heritage', href: '/products?category=men' },
                    { label: 'New Arrivals', href: '/products?new=true' },
                ].map((link) => (
                    <li key={link.label}>
                    <Link 
                        to={link.href} 
                        className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                        {link.label}
                    </Link>
                    </li>
                ))}
                </ul>
            </div>

            <div className="space-y-8">
                <h3 className="text-[10px] font-bold tracking-[0.4em] uppercase text-secondary">The Atelier</h3>
                <ul className="space-y-4">
                {[
                    { label: 'About Us', href: '/about' },
                    { label: 'Our Heritage', href: '/heritage' },
                    { label: 'Quality Guide', href: '/quality' },
                    { label: 'Store Locator', href: '/stores' },
                    { label: 'Careers', href: '/careers' },
                ].map((link) => (
                    <li key={link.label}>
                    <Link 
                        to={link.href} 
                        className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                        {link.label}
                    </Link>
                    </li>
                ))}
                </ul>
            </div>

            <div className="space-y-8 col-span-2 md:col-span-1">
                <h3 className="text-[10px] font-bold tracking-[0.4em] uppercase text-secondary">Concierge</h3>
                <ul className="space-y-6">
                <li className="space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 block">Visit Us</span>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-foreground/80 leading-relaxed">
                        Khalilabad-272175,<br />Sant Kabir Nagar, U.P.
                    </span>
                </li>
                <li className="space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 block">Inquiries</span>
                    <a href="tel:+917607027228" className="text-[11px] font-bold uppercase tracking-widest text-foreground/80 hover:text-primary transition-colors">
                        +91 76070 27228
                    </a>
                </li>
                </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-12 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                © {new Date().getFullYear()} BALAJI TEXTILES. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-8">
                <Link to="/privacy" className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-primary transition-colors">Privacy</Link>
                <Link to="/terms" className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-primary transition-colors">Terms</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-8 opacity-40 grayscale hover:opacity-80 hover:grayscale-0 transition-all duration-1000">
             <div className="text-[10px] font-black tracking-widest">VISA</div>
             <div className="text-[10px] font-black tracking-widest">MASTERCARD</div>
             <div className="text-[10px] font-black tracking-widest">UPI</div>
             <div className="text-[10px] font-black tracking-widest">RUPAY</div>
          </div>
        </div>
      </div>
    </footer>
  );
}