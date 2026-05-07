
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Truck, Clock, Globe } from 'lucide-react';

export default function Shipping() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background py-16">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-display font-bold mb-8">Shipping & Delivery Policies</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card p-6 border border-border rounded-xl text-center">
              <Truck className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-bold mb-2">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">On all orders above ₹5000</p>
            </div>
            <div className="bg-card p-6 border border-border rounded-xl text-center">
              <Clock className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-bold mb-2">Fast Delivery</h3>
              <p className="text-sm text-muted-foreground">Dispatched within 24 hours</p>
            </div>
            <div className="bg-card p-6 border border-border rounded-xl text-center">
              <Globe className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-bold mb-2">Pan India</h3>
              <p className="text-sm text-muted-foreground">Delivery across all pin codes</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-muted-foreground">
            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">Shipping Timeframes</h3>
            <p className="mb-4">
              We strive to deliver your order as quickly as possible. Standard delivery usually takes 5-7 business days depending on your location.
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Metro Cities:</strong> 3-5 Business Days</li>
              <li><strong>Rest of India:</strong> 5-7 Business Days</li>
              <li><strong>Remote Areas:</strong> 7-10 Business Days</li>
            </ul>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">Shipping Charges</h3>
            <p className="mb-4">
              We offer free shipping on all orders totaling ₹5000 or more. For orders below this amount, a flat shipping fee of ₹99 will be applied at checkout.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">Order Tracking</h3>
            <p className="mb-4">
              Once your order has been dispatched, you will receive an email/SMS with the tracking details. You can track your package directly on our website using the "Track Order" page.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
