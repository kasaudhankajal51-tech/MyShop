
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Mail, MapPin, Phone, Clock, Send } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

import api from '@/lib/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await api.post('/contact', formData);
      toast({
        title: "Message Sent",
        description: "We'll get back to you as soon as possible.",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <main className="flex-1">
        {/* Editorial Page Header */}
        <section className="container py-24 lg:py-32 border-b border-border/40">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12">
            <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-display font-medium tracking-tight italic">
                    Contact <span className="not-italic font-bold text-primary">Atelier</span>
                </h1>
                <p className="text-[11px] font-black tracking-[0.4em] uppercase text-muted-foreground/60 flex items-center gap-4">
                    <span className="w-12 h-px bg-primary/20" /> BESPOKE SERVICE & INQUIRIES
                </p>
            </div>
            <div className="max-w-md text-right">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground/40 leading-relaxed italic">
                    Our concierge team is dedicated to providing an unparalleled experience. Reach out for curated advice or personalized styling.
                </p>
            </div>
          </div>
        </section>

        <div className="container py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
            {/* Contact Information Sidebar */}
            <div className="lg:col-span-5 space-y-20">
              <div className="space-y-12">
                <div className="space-y-4">
                    <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-secondary">01. THE ATELIER</h2>
                    <div className="h-px w-12 bg-primary/20" />
                </div>
                <div className="space-y-8">
                    <div className="flex gap-8 group">
                      <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <MapPin className="h-4 w-4" strokeWidth={1.5} />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[11px] font-black tracking-widest uppercase">LOCATION</p>
                        <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground/60 uppercase leading-relaxed">
                          H. NO. 24 WARD NO. 16, DURGA NAGAR,<br />
                          BARDAHIYA BAZAAR, KHALILABAD-272175<br />
                          SANT KABIR NAGAR, UTTAR PRADESH
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-8 group">
                      <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <Phone className="h-4 w-4" strokeWidth={1.5} />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[11px] font-black tracking-widest uppercase">TELEPHONE</p>
                        <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground/60 uppercase">+91 76070 27228</p>
                        <p className="text-[9px] font-black tracking-[0.4em] text-primary/40 uppercase">MON-SAT / 10AM — 9PM IST</p>
                      </div>
                    </div>

                    <div className="flex gap-8 group">
                      <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <Mail className="h-4 w-4" strokeWidth={1.5} />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[11px] font-black tracking-widest uppercase">CORRESPONDENCE</p>
                        <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground/60 uppercase">INFO@JAISHREEBALAJI.COM</p>
                      </div>
                    </div>
                </div>
              </div>
            </div>

            {/* Redesigned Contact Form */}
            <div className="lg:col-span-7 bg-secondary/5 p-12 lg:p-20 border border-border/40 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-16">
                <div className="space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-secondary">02. SEND CORRESPONDENCE</h2>
                        <div className="h-px w-12 bg-primary/20" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="relative group">
                        <Input 
                          id="name" 
                          placeholder="YOUR IDENTITY" 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                          className="bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-6 text-[11px] font-bold tracking-widest focus-visible:ring-0 focus-visible:border-primary transition-all uppercase placeholder:text-muted-foreground/20"
                        />
                        <div className="absolute bottom-0 left-0 h-px w-0 bg-primary group-focus-within:w-full transition-all duration-700" />
                      </div>
                      <div className="relative group">
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="EMAIL ADDRESS" 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                          className="bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-6 text-[11px] font-bold tracking-widest focus-visible:ring-0 focus-visible:border-primary transition-all uppercase placeholder:text-muted-foreground/20"
                        />
                        <div className="absolute bottom-0 left-0 h-px w-0 bg-primary group-focus-within:w-full transition-all duration-700" />
                      </div>
                    </div>

                    <div className="relative group">
                      <Input 
                        id="subject" 
                        placeholder="NATURE OF INQUIRY" 
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        required
                        className="bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-6 text-[11px] font-bold tracking-widest focus-visible:ring-0 focus-visible:border-primary transition-all uppercase placeholder:text-muted-foreground/20"
                      />
                      <div className="absolute bottom-0 left-0 h-px w-0 bg-primary group-focus-within:w-full transition-all duration-700" />
                    </div>

                    <div className="relative group">
                      <Textarea 
                        id="message" 
                        placeholder="ELABORATE YOUR MESSAGE" 
                        className="bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-6 text-[11px] font-bold tracking-widest focus-visible:ring-0 focus-visible:border-primary transition-all uppercase placeholder:text-muted-foreground/20 min-h-[150px] resize-none"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        required
                      />
                      <div className="absolute bottom-0 left-0 h-px w-0 bg-primary group-focus-within:w-full transition-all duration-700" />
                    </div>
                </div>

                <Button 
                    type="submit" 
                    size="xl" 
                    className="w-full h-20 bg-primary hover:bg-primary/90 text-white rounded-none text-[11px] font-bold tracking-[0.5em] uppercase shadow-2xl transition-all" 
                    disabled={isSubmitting}
                >
                  {isSubmitting ? 'SENDING...' : 'TRANSMIT MESSAGE'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
