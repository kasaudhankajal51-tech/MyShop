
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SizeGuide() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background py-16">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-display font-bold mb-8 text-center">Size Guide</h1>
          <p className="text-center text-muted-foreground mb-12">
            Use our size charts to find your perfect fit. All measurements are in inches.
          </p>

          <Tabs defaultValue="men" className="w-full">
            <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="men">Men's Sizing</TabsTrigger>
                <TabsTrigger value="women">Women's Sizing</TabsTrigger>
                </TabsList>
            </div>
            
            <TabsContent value="men">
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-secondary/50">
                        <tr>
                        <th className="px-6 py-4 rounded-tl-xl">Size</th>
                        <th className="px-6 py-4">Chest (in)</th>
                        <th className="px-6 py-4">Waist (in)</th>
                        <th className="px-6 py-4 rounded-tr-xl">Shoulder (in)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-border/50">
                        <td className="px-6 py-4 font-bold">S</td>
                        <td className="px-6 py-4">36-38</td>
                        <td className="px-6 py-4">28-30</td>
                        <td className="px-6 py-4">17</td>
                        </tr>
                        <tr className="border-b border-border/50 bg-secondary/10">
                        <td className="px-6 py-4 font-bold">M</td>
                        <td className="px-6 py-4">38-40</td>
                        <td className="px-6 py-4">30-32</td>
                        <td className="px-6 py-4">18</td>
                        </tr>
                        <tr className="border-b border-border/50">
                        <td className="px-6 py-4 font-bold">L</td>
                        <td className="px-6 py-4">40-42</td>
                        <td className="px-6 py-4">32-34</td>
                        <td className="px-6 py-4">19</td>
                        </tr>
                        <tr className="border-b border-border/50 bg-secondary/10">
                        <td className="px-6 py-4 font-bold">XL</td>
                        <td className="px-6 py-4">42-44</td>
                        <td className="px-6 py-4">34-36</td>
                        <td className="px-6 py-4">20</td>
                        </tr>
                        <tr>
                        <td className="px-6 py-4 font-bold">XXL</td>
                        <td className="px-6 py-4">44-46</td>
                        <td className="px-6 py-4">36-38</td>
                        <td className="px-6 py-4">21</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="women">
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-secondary/50">
                        <tr>
                        <th className="px-6 py-4 rounded-tl-xl">Size</th>
                        <th className="px-6 py-4">Bust (in)</th>
                        <th className="px-6 py-4">Waist (in)</th>
                        <th className="px-6 py-4 rounded-tr-xl">Hips (in)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-border/50">
                        <td className="px-6 py-4 font-bold">XS</td>
                        <td className="px-6 py-4">30-32</td>
                        <td className="px-6 py-4">24-26</td>
                        <td className="px-6 py-4">32-34</td>
                        </tr>
                        <tr className="border-b border-border/50 bg-secondary/10">
                        <td className="px-6 py-4 font-bold">S</td>
                        <td className="px-6 py-4">32-34</td>
                        <td className="px-6 py-4">26-28</td>
                        <td className="px-6 py-4">34-36</td>
                        </tr>
                        <tr className="border-b border-border/50">
                        <td className="px-6 py-4 font-bold">M</td>
                        <td className="px-6 py-4">34-36</td>
                        <td className="px-6 py-4">28-30</td>
                        <td className="px-6 py-4">36-38</td>
                        </tr>
                         <tr className="border-b border-border/50 bg-secondary/10">
                        <td className="px-6 py-4 font-bold">L</td>
                        <td className="px-6 py-4">36-38</td>
                        <td className="px-6 py-4">30-32</td>
                        <td className="px-6 py-4">38-40</td>
                        </tr>
                         <tr>
                        <td className="px-6 py-4 font-bold">XL</td>
                        <td className="px-6 py-4">38-40</td>
                        <td className="px-6 py-4">32-34</td>
                        <td className="px-6 py-4">40-42</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
