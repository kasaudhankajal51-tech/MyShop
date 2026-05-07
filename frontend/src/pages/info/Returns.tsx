
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Returns() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background py-16">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-display font-bold mb-8">Returns & Refunds</h1>
          
          <div className="bg-accent/10 border border-accent/20 rounded-xl p-8 mb-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Easy 7-Day Returns</h2>
            <p className="text-muted-foreground mb-6">Not satisfied with your purchase? No problem. We have a hassle-free return policy.</p>
            <Button asChild>
                <Link to="/contact">Request a Return</Link>
            </Button>
          </div>

          <div className="prose prose-slate max-w-none text-muted-foreground">
            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">Return Policy</h3>
            <p className="mb-4">
              You can return any unworn, unwashed, and undamaged item with original tags within 7 days of delivery.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">Non-Returnable Items</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Innerwear and Lingerie</li>
              <li>Socks and Accessories</li>
              <li>Customized or Altered Items</li>
              <li>Sale or Clearance Items</li>
            </ul>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">Refund Process</h3>
            <p className="mb-4">
              Once we receive your return shipment, our quality team will inspect it. If approved, your refund will be processed within 5-7 business days to your original payment method. For Cash on Delivery orders, we will transfer the amount to your provided bank account.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
