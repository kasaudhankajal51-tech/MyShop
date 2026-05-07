import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import { Switch } from '@/components/ui/switch';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, Loader2, ImageIcon, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface FlashDeal {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  originalPrice?: number;
  discountPrice?: number;
  discountPercent?: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export default function AdminFlashDeals() {
  const [flashDeals, setFlashDeals] = useState<FlashDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FlashDeal | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    link: '',
    originalPrice: 0,
    discountPrice: 0,
    discountPercent: 0,
    isActive: true,
    sortOrder: 0,
  });

  useEffect(() => {
    fetchFlashDeals();
  }, []);

  const fetchFlashDeals = async () => {
    try {
      const { data } = await api.get('/flashdeals');
      setFlashDeals(data || []);
    } catch (error) {
      console.error('Error fetching flash deals:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch flash deals',
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
      const dealData = {
        title: formData.title,
        subtitle: formData.subtitle,
        image: formData.image,
        link: formData.link,
        originalPrice: formData.originalPrice,
        discountPrice: formData.discountPrice,
        discountPercent: formData.discountPercent,
        isActive: formData.isActive,
        sortOrder: formData.sortOrder,
      };

      if (editingItem) {
        await api.put(`/flashdeals/${editingItem._id}`, dealData);
        toast({ title: 'Success', description: 'Flash deal updated successfully' });
      } else {
        await api.post('/flashdeals', dealData);
        toast({ title: 'Success', description: 'Flash deal created successfully' });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchFlashDeals();
    } catch (error: any) {
      console.error('Error saving flash deal:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save flash deal',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: FlashDeal) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      subtitle: item.subtitle || '',
      image: item.image || '',
      link: item.link || '',
      originalPrice: item.originalPrice || 0,
      discountPrice: item.discountPrice || 0,
      discountPercent: item.discountPercent || 0,
      isActive: item.isActive,
      sortOrder: item.sortOrder || 0,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this flash deal?')) return;

    try {
      await api.delete(`/flashdeals/${id}`);
      toast({ title: 'Success', description: 'Flash deal deleted successfully' });
      fetchFlashDeals();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete flash deal',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      subtitle: '',
      image: '',
      link: '',
      originalPrice: 0,
      discountPrice: 0,
      discountPercent: 0,
      isActive: true,
      sortOrder: 0,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2">
              <Zap className="h-8 w-8 text-yellow-500" />
              Flash Deals
            </h1>
            <p className="text-muted-foreground mt-1">Manage limited-time flash deals</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Flash Deal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Flash Deal' : 'Add New Flash Deal'}</DialogTitle>
                <DialogDescription>
                  Fill in the flash deal details below
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., iPhone 15 Pro Max"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="e.g., Limited Stock"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image"
                      type="text"
                      placeholder="Enter image URL or upload file below"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image-file" className="text-sm text-muted-foreground">Or upload from computer</Label>
                    <Input
                      id="image-file"
                      type="file"
                      accept="image/*"
                      className="cursor-pointer"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          import('@/lib/api').then(async ({ uploadImage }) => {
                            try {
                              const result = await uploadImage(file);
                              setFormData(prev => ({ ...prev, image: result.image }));
                              toast({ title: 'Success', description: 'Image uploaded successfully' });
                            } catch (error) {
                              toast({ title: 'Error', description: 'Failed to upload image', variant: 'destructive' });
                            }
                          });
                        }
                      }}
                    />
                  </div>
                  {formData.image && (
                    <div className="mt-2 rounded-lg border overflow-hidden">
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Invalid+Image+URL';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Original Price</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                      placeholder="999"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discountPrice">Discount Price</Label>
                    <Input
                      id="discountPrice"
                      type="number"
                      value={formData.discountPrice}
                      onChange={(e) => setFormData({ ...formData, discountPrice: parseFloat(e.target.value) || 0 })}
                      placeholder="799"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discountPercent">Discount %</Label>
                    <Input
                      id="discountPercent"
                      type="number"
                      value={formData.discountPercent}
                      onChange={(e) => setFormData({ ...formData, discountPercent: parseFloat(e.target.value) || 0 })}
                      placeholder="20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link">Link URL</Label>
                  <Input
                    id="link"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="/products or https://example.com"
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional link when users click the deal
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Lower numbers appear first
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <Label htmlFor="isActive">Active</Label>
                    <p className="text-xs text-muted-foreground">
                      Only active deals will be displayed on the homepage
                    </p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingItem ? 'Update Deal' : 'Create Deal'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader />
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Prices</TableHead>
                    <TableHead className="w-[100px]">Sort Order</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="text-right w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flashDeals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No flash deals found. Create your first flash deal!
                      </TableCell>
                    </TableRow>
                  ) : (
                    flashDeals.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>
                          <div className="w-20 h-12 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.parentElement!.innerHTML = '<div class="text-muted-foreground"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></div>';
                                }}
                              />
                            ) : (
                              <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.title}</div>
                            {item.subtitle && (
                              <div className="text-sm text-muted-foreground">{item.subtitle}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {item.originalPrice && (
                              <div className="text-sm line-through text-muted-foreground">
                                ₹{item.originalPrice}
                              </div>
                            )}
                            {item.discountPrice && (
                              <div className="font-bold text-green-600">
                                ₹{item.discountPrice}
                              </div>
                            )}
                            {item.discountPercent && (
                              <div className="text-xs text-red-600 font-semibold">
                                {item.discountPercent}% OFF
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{item.sortOrder}</TableCell>
                        <TableCell>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                            item.isActive 
                              ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {item.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(item)}
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item._id)}
                            title="Delete"
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
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
