
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background py-16">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-display font-bold mb-8">Terms of Service</h1>
          <div className="prose prose-slate max-w-none text-muted-foreground">
            <p className="leading-relaxed mb-4">
              Welcome to Jai Shree Balaji Readymade. By accessing or using our website, you agree to be bound by these Terms of Service. Please read them carefully before making a purchase.
            </p>
            
            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">1. General Conditions</h3>
            <p className="mb-4">
              We reserve the right to refuse service to anyone for any reason at any time. You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service without express written permission by us.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">2. Products and Pricing</h3>
            <p className="mb-4">
              Prices for our products are subject to change without notice. We plan to display images of products as accurately as possible, but we cannot guarantee that your monitor's display of any color will be accurate.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">3. Billing and Account Information</h3>
            <p className="mb-4">
              We reserve the right to refuse any order you place with us. In the event that we make a change to or cancel an order, we may attempt to notify you by contacting the e-mail and/or billing address/phone number provided at the time the order was made.
            </p>

             <h3 className="text-xl font-bold text-foreground mt-8 mb-4">4. Governing Law</h3>
            <p className="mb-4">
              These Terms of Service shall be governed by and construed in accordance with the laws of India and jurisdiction of Uttar Pradesh.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">5. Changes to Terms</h3>
            <p>
              You can review the most current version of the Terms of Service at any time at this page. We reserve the right to update, change or replace any part of these Terms of Service by posting updates.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
