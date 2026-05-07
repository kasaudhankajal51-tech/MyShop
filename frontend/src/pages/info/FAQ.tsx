
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background py-16">
        <div className="container max-w-3xl">
          <h1 className="text-4xl font-display font-bold mb-8 text-center">Frequently Asked Questions</h1>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg px-4">
              <AccordionTrigger className="text-lg font-medium">How do I track my order?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                You can track your order by clicking on the "Track Order" link in the footer and entering your Order ID. Alternatively, we send tracking updates via email and SMS.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-lg px-4">
              <AccordionTrigger className="text-lg font-medium">What payment methods do you accept?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We accept all major credit/debit cards (Visa, Mastercard, RuPay), UPI (GPay, PhonePe, Paytm), Net Banking, and Cash on Delivery (COD) for eligible pin codes.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-lg px-4">
              <AccordionTrigger className="text-lg font-medium">Can I cancel my order?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes, you can cancel your order before it has been shipped. Please visit your "My Orders" section or contact our customer support immediately.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-lg px-4">
              <AccordionTrigger className="text-lg font-medium">Do you ship internationally?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Currently, we only ship within India. We are working on expanding to international locations soon.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5" className="border rounded-lg px-4">
              <AccordionTrigger className="text-lg font-medium">What is your return policy?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We offer a 7-day return policy for unused and unworn items with original tags. Please refer to our Refund Policy page for more details.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  );
}
