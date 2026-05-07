
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background py-16">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-display font-bold mb-8">Privacy Policy</h1>
          <div className="prose prose-slate max-w-none text-muted-foreground">
            <p className="leading-relaxed mb-4">
              At Jai Shree Balaji Readymade, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you visit our website or make a purchase.
            </p>
            
            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">1. Information We Collect</h3>
            <p className="mb-4">
              We collect information that you provide securely when creating an account or placing an order such as name, email address, shipping address, and phone number. We do not store your payment details directly; they are processed securely by our trusted payment partners.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">2. How We Use Your Information</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>To process and fulfill your orders effectively.</li>
              <li>To communicate with you regarding order updates and support.</li>
              <li>To send promotional emails (only if you have opted in).</li>
              <li>To improve our website functionality and customer service.</li>
            </ul>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">3. Data Security</h3>
            <p className="mb-4">
              We implement industry-standard security measures including SSL encryption to protect your personal data during transmission and storage.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">4. Cookies</h3>
            <p className="mb-4">
              Our website uses cookies to enhance your browsing experience, remember your cart items, and analyze site traffic. You can choose to disable cookies through your browser settings, though some features may not work as intended.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">5. Contact Us</h3>
            <p>
              If you have any questions regarding this Privacy Policy, please contact us at <strong>info@jaishreebalaji.com</strong>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
