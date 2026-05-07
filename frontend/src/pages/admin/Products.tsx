import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Product {
  _id: string; // Changed id to _id
  id?: string;
  name: string;
  slug: string; // Backend might not rely on this but we can send it or generate it
  price: number;
  originalPrice?: number; // Mapped from compare_at_price
  description: string;
  season: 'summer' | 'winter';
  category: 'men' | 'women'; // Changed from gender effectively
  countInStock: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  image?: string;
  // Extras
  subcategory?: string;
  sizes?: string[];
  colors?: any[];
  images?: string[];
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '',
    originalPrice: '',
    description: '',
    season: 'summer',
    category: 'men', // Using category field for gender/category
    countInStock: '0',
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    image: '',
    images: [] as string[],
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
        fetchProducts();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Use keyword for server-side search, pageNumber for pagination
      const { data } = await api.get('/products', {
         params: {
            keyword: search,
            pageNumber: page,
            pageSize: 10, // Admin view
            mode: 'retail' // Show products relevant to retail (or all, but backend default logic is fine)
         }
      });
      
      // Handle new response format { products, page, pages }
      if (data.products) {
          setProducts(data.products);
          setPages(data.pages || 1);
      } else {
          // Fallback if structure is different
          setProducts(data || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const productData = {
        name: formData.name,
        // slug: formData.slug ... backend might not use slug, but let's keep it if needed or ignore
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        description: formData.description,
        season: formData.season,
        category: formData.category,
        countInStock: parseInt(formData.countInStock),
        isFeatured: formData.isFeatured,
        isBestSeller: formData.isBestSeller,
        isNewArrival: formData.isNewArrival,
        image: formData.image || '/placeholder.svg', // Default image (keep main image logic for compatibility)
        images: formData.images, // Send multiple images
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id || editingProduct.id}`, productData);
        toast({ title: 'Success', description: 'Product updated successfully' });
      } else {
        await api.post('/products', productData);
        toast({ title: 'Success', description: 'Product created successfully' });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save product',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug || '',
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      description: product.description || '',
      season: product.season || 'summer',
      category: product.category || 'men',
      countInStock: product.countInStock?.toString() || '0',
      isFeatured: product.isFeatured || false,
      isBestSeller: product.isBestSeller || false,
      isNewArrival: product.isNewArrival || false,
      isNewArrival: product.isNewArrival || false,
      image: product.image || '',
      images: product.images || [],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.delete(`/products/${id}`);
      toast({ title: 'Success', description: 'Product deleted successfully' });
      fetchProducts();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete product',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      price: '',
      originalPrice: '',
      description: '',
      season: 'summer',
      category: 'men',
      countInStock: '0',
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: false,
      image: '',
      images: [],
    });
  };

  // Removed client-side filtering since we now use server-side search
  // const filteredProducts = products.filter(...)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground mt-1">Manage your product catalog</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                <DialogDescription>
                  Fill in the product details below
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="countInStock">Stock</Label>
                    <Input
                      id="countInStock"
                      type="number"
                      value={formData.countInStock}
                      onChange={(e) => setFormData({ ...formData, countInStock: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Original Price (₹)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="season">Season</Label>
                    <select
                      id="season"
                      value={formData.season}
                      onChange={(e) => setFormData({ ...formData, season: e.target.value as any })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="summer">Summer</option>
                      <option value="winter">Winter</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="men">Men</option>
                      <option value="women">Women</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image</Label>
                   <div className="space-y-4">
                      <div className="flex gap-4 items-center">
                          <Input
                            id="image"
                            type="text"
                            placeholder="Main Image URL"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          />
                          <div className="w-full">
                            <Label htmlFor="images-file" className="sr-only">Upload Images</Label>
                             <Input
                                id="images-file"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={async (e) => {
                                  const files = e.target.files;
                                  if (files && files.length > 0) {
                                     import('@/lib/api').then(async ({ uploadImages, uploadImage }) => {
                                        try {
                                            // Call the new multiple upload API
                                          const result = await uploadImages(files);
                                          
                                          // Update state
                                          setFormData(prev => {
                                              const newImages = [...prev.images, ...result.images];
                                              // If main image is empty, use the first uploaded one
                                              const mainImage = prev.image || result.images[0];
                                              return { ...prev, images: newImages, image: mainImage };
                                          });

                                          toast({ title: 'Success', description: `${files.length} images uploaded` });
                                        } catch (error) {
                                           toast({ title: 'Error', description: 'Failed to upload images', variant: 'destructive' });
                                        }
                                     });
                                  }
                                }}
                              />
                          </div>
                      </div>
                      
                      {/* Image Previews */}
                      {formData.images.length > 0 && (
                          <div className="grid grid-cols-4 gap-4 mt-4">
                              {formData.images.map((img, index) => (
                                  <div key={index} className="relative group aspect-square border rounded-md overflow-hidden">
                                      <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                      <button
                                          type="button"
                                          onClick={() => {
                                              const newImages = formData.images.filter((_, i) => i !== index);
                                              // If we removed the main image, update it to the next one or empty
                                              let newMainImage = formData.image;
                                              if (formData.image === img) {
                                                  newMainImage = newImages.length > 0 ? newImages[0] : '';
                                              }
                                              setFormData({ ...formData, images: newImages, image: newMainImage });
                                          }}
                                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                          <Trash2 className="h-3 w-3" />
                                      </button>
                                      {/* Set as Main */}
                                      {formData.image !== img && (
                                         <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, image: img })}
                                            className="absolute bottom-1 left-1 right-1 bg-black/60 text-white text-[10px] py-1 opacity-0 group-hover:opacity-100 transition-opacity text-center"
                                         >
                                            Set as Main
                                         </button>
                                      )}
                                      {formData.image === img && (
                                          <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded">
                                              Main
                                          </div>
                                      )}
                                  </div>
                              ))}
                          </div>
                      )}
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <Label htmlFor="isFeatured">Featured</Label>
                    <Switch
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <Label htmlFor="isBestSeller">Best Seller</Label>
                    <Switch
                      id="isBestSeller"
                      checked={formData.isBestSeller}
                      onCheckedChange={(checked) => setFormData({ ...formData, isBestSeller: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <Label htmlFor="isNewArrival">New Arrival</Label>
                    <Switch
                      id="isNewArrival"
                      checked={formData.isNewArrival}
                      onCheckedChange={(checked) => setFormData({ ...formData, isNewArrival: checked })}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Season</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No products found
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => (
                      <TableRow key={product._id || product.id}>
                        <TableCell>
                          <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted border border-border">
                            <img
                              src={product.image || product.images?.[0] || '/placeholder.svg'}
                              alt={product.name}
                              className="h-full w-full object-contain"
                              loading="lazy"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{formatCurrency(product.price)}</TableCell>
                        <TableCell className="capitalize">{product.season || '-'}</TableCell>
                        <TableCell className="capitalize">{product.category || '-'}</TableCell>
                        <TableCell>{product.countInStock}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(product._id || product.id!)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
            
            {/* Pagination Controls */}
             {pages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {page} of {pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(pages, p + 1))}
                  disabled={page === pages || loading}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
