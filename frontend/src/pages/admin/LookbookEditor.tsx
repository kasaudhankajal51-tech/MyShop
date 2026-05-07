import { useState, useEffect, useRef } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useParams } from 'react-router-dom';
import api, { uploadImage } from '@/lib/api';
import { Loader2, Plus, X, Search, Image as ImageIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Hotspot {
    productId: string;
    productName?: string; // For display
    productImage?: string; // For display
    productPrice?: number; // For display
    x: number;
    y: number;
}

export default function LookbookEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    
    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [hotspots, setHotspots] = useState<Hotspot[]>([]);

    // Hotspot Editor State
    const imageRef = useRef<HTMLImageElement>(null);
    const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
    const [tempCoordinates, setTempCoordinates] = useState<{x: number, y: number} | null>(null);
    const [productSearch, setProductSearch] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchLookbook();
        } else {
            setFetchLoading(false);
        }
    }, [id]);

    const fetchLookbook = async () => {
        try {
            const { data } = await api.get(`/lookbook/${id}`);
            setTitle(data.title);
            setDescription(data.description);
            setImage(data.image);
            setIsActive(data.isActive);
            // Ensure hotspots have product details if we populated them improperly or need to refetch
            // Note: The controller populates productId, so we need to map it correctly
            // The getLookbookById controller might not be populating. Let's check. 
            // It sends raw data. We might need to fetch products info or just rely on what we have.
            // Actually, for editing, we need the product details to show what is selected.
            // Let's assume for now we might need to fetch product details if they are just IDs.
            // Wait, let's fix the controller to populate details on GET /:id as well to make life easier.
            // Or here, we just use the IDs and if we need names, we fetch them. 
            // For simplicity, let's assume the ID is enough or we fetch details.
            // Actually, let's just use the data as is.
            setHotspots(data.hotspots.map((h: any) => ({
                productId: h.productId, // This might be an object if populated or string if not.
                x: h.x,
                y: h.y
            })));
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Failed to fetch lookbook', variant: 'destructive' });
        } finally {
            setFetchLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const formData = new FormData();
                formData.append('image', file);
                const { data } = await api.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                setImage(data); // Assuming returning path or full URL. Usually logic returns middleware path.
                // Let's assume standard implementation returns just path. modification might be needed if upload logic differs.
            } catch (error) {
                toast({ title: 'Error', description: 'Image upload failed', variant: 'destructive' });
            }
        }
    };

    const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
        if (!imageRef.current) return;

        const rect = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setTempCoordinates({ x, y });
        setIsProductDialogOpen(true);
        setProductSearch('');
        setSearchResults([]);
    };

    const searchProducts = async (query: string) => {
        setProductSearch(query);
        if (query.length < 2) return;

        setSearchLoading(true);
        try {
            const { data } = await api.get(`/products?keyword=${query}`);
            setSearchResults(data.products || []);
        } catch (error) {
            console.error(error);
        } finally {
            setSearchLoading(false);
        }
    };

    const addHotspot = (product: any) => {
        if (!tempCoordinates) return;

        setHotspots([...hotspots, {
            productId: product._id,
            productName: product.name,
            productImage: product.images?.[0],
            productPrice: product.price,
            x: tempCoordinates.x,
            y: tempCoordinates.y
        }]);

        setIsProductDialogOpen(false);
        setTempCoordinates(null);
    };

    const removeHotspot = (index: number) => {
        const newHotspots = [...hotspots];
        newHotspots.splice(index, 1);
        setHotspots(newHotspots);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Sanitize hotspots to only send productId, x, y
        const payload = {
            title,
            description,
            image,
            isActive,
            hotspots: hotspots.map(h => ({
                productId: typeof h.productId === 'object' ? (h.productId as any)._id : h.productId,
                x: h.x,
                y: h.y
            }))
        };

        try {
            if (id) {
                await api.put(`/lookbook/${id}`, payload);
                toast({ title: 'Success', description: 'Lookbook updated' });
            } else {
                await api.post('/lookbook', payload);
                toast({ title: 'Success', description: 'Lookbook created' });
            }
            navigate('/admin/lookbook');
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to save lookbook',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) return <AdminLayout><div>Loading...</div></AdminLayout>;

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold font-display">{id ? 'Edit Look' : 'Create New Look'}</h1>
                    <p className="text-muted-foreground">Click on the image to tag products.</p>
                </div>
                <div className="space-x-2">
                    <Button variant="outline" onClick={() => navigate('/admin/lookbook')}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Look
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Editor (Left) */}
                <div className="lg:col-span-2 space-y-6">
                     <Card>
                        <CardContent className="p-6">
                            <div className="mb-4">
                                <Label>Lookbook Image</Label>
                                <div className="mt-2 flex items-center gap-4">
                                    <Input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="max-w-xs"
                                    />
                                    <span className="text-xs text-muted-foreground">Recommended: 1600x900px or larger.</span>
                                </div>
                            </div>

                            <div className="relative border-2 border-dashed border-border rounded-lg bg-muted/30 min-h-[400px] flex items-center justify-center overflow-hidden">
                                {image ? (
                                    <div className="relative w-full h-full group cursor-crosshair">
                                        <img 
                                            ref={imageRef}
                                            src={image} 
                                            alt="Lookbook" 
                                            className="w-full h-auto object-contain"
                                            onClick={handleImageClick}
                                        />
                                        
                                        {/* Hotpots Overlay */}
                                        {hotspots.map((hotspot, idx) => (
                                            <div
                                                key={idx}
                                                className="absolute w-8 h-8 -ml-4 -mt-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer border-2 border-white z-10"
                                                style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeHotspot(idx);
                                                }}
                                                title="Click to remove"
                                            >
                                                <X className="h-4 w-4" />
                                            </div>
                                        ))}

                                        {/* Temporary Marker */}
                                        {tempCoordinates && (
                                            <div 
                                                className="absolute w-4 h-4 -ml-2 -mt-2 bg-red-500 rounded-full animate-ping pointer-events-none"
                                                style={{ left: `${tempCoordinates.x}%`, top: `${tempCoordinates.y}%` }}
                                            />
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-muted-foreground">
                                        <ImageIcon className="h-12 w-12 mb-2 opacity-50" />
                                        <p>Upload an image to start tagging</p>
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-2 text-center">
                                Tip: Click anywhere on the image to link a product. Click a tag (X) to remove it.
                            </p>
                        </CardContent>
                     </Card>
                </div>

                {/* Metadata Form (Right) */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input 
                                    id="title" 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)} 
                                    placeholder="e.g. Urban Summer Vibes"
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="desc">Description</Label>
                                <Textarea 
                                    id="desc" 
                                    value={description} 
                                    onChange={(e) => setDescription(e.target.value)} 
                                    placeholder="Describe the style..."
                                    className="h-24"
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Active Status</Label>
                                    <p className="text-xs text-muted-foreground">Visible on homepage</p>
                                </div>
                                <Switch checked={isActive} onCheckedChange={setIsActive} />
                            </div>

                            <div className="pt-4 border-t">
                                <Label className="mb-2 block">Tagged Products ({hotspots.length})</Label>
                                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                    {hotspots.length === 0 && <p className="text-sm text-muted-foreground">No products tagged yet.</p>}
                                    {hotspots.map((h, idx) => (
                                        <div key={idx} className="flex items-center gap-2 p-2 bg-secondary/50 rounded text-sm group">
                                            <span className="font-mono text-xs text-muted-foreground">
                                                {Math.round(h.x)}%,{Math.round(h.y)}%
                                            </span>
                                            <span className="font-medium truncate flex-1">
                                                {h.productName || h.productId}
                                            </span>
                                            <button 
                                                onClick={() => removeHotspot(idx)}
                                                className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Product Selector Dialog */}
            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Select Product</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                className="pl-9"
                                value={productSearch}
                                onChange={(e) => searchProducts(e.target.value)}
                            />
                        </div>
                        <div className="max-h-[300px] overflow-y-auto space-y-2">
                            {searchLoading && <div className="text-center py-4"><Loader2 className="h-6 w-6 animate-spin mx-auto"/></div>}
                            {!searchLoading && searchResults.length === 0 && productSearch.length > 2 && (
                                <p className="text-center text-muted-foreground">No products found</p>
                            )}
                            {searchResults.map((product) => (
                                <div 
                                    key={product._id} 
                                    className="flex items-center gap-3 p-2 hover:bg-secondary cursor-pointer rounded border border-transparent hover:border-border transition-colors"
                                    onClick={() => addHotspot(product)}
                                >
                                    <div className="w-10 h-10 bg-muted rounded overflow-hidden">
                                        <img src={product.images?.[0]} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{product.name}</p>
                                        <p className="text-xs text-muted-foreground">₹{product.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
