import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

interface Lookbook {
    _id: string;
    title: string;
    description: string;
    image: string;
    isActive: boolean;
    hotspots: any[];
}

export default function AdminLookbook() {
    const [lookbooks, setLookbooks] = useState<Lookbook[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        fetchLookbooks();
    }, []);

    const fetchLookbooks = async () => {
        try {
            const { data } = await api.get('/lookbook/admin');
            setLookbooks(data);
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to fetch lookbooks',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this lookbook?')) return;

        try {
            await api.delete(`/lookbook/${id}`);
            toast({
                title: 'Success',
                description: 'Lookbook deleted successfully',
            });
            fetchLookbooks();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to delete lookbook',
                variant: 'destructive',
            });
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold font-display">Shop The Look</h1>
                    <p className="text-muted-foreground">Manage your curated looks and hotspots.</p>
                </div>
                <Button onClick={() => navigate('/admin/lookbook/create')}>
                    <Plus className="mr-2 h-4 w-4" /> Create New Look
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lookbook Library</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-4">Loading...</div>
                    ) : lookbooks.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No lookbooks found. Create your first one!
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Hotspots</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {lookbooks.map((lookbook) => (
                                    <TableRow key={lookbook._id}>
                                        <TableCell>
                                            <div className="w-16 h-16 rounded overflow-hidden bg-muted">
                                                <img 
                                                    src={lookbook.image} 
                                                    alt={lookbook.title} 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <div>{lookbook.title}</div>
                                            <div className="text-xs text-muted-foreground truncate w-48">{lookbook.description}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{lookbook.hotspots.length} Products</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={lookbook.isActive ? 'default' : 'secondary'}>
                                                {lookbook.isActive ? 'Active' : 'Draft'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button 
                                                variant="ghost" 
                                                size="icon"
                                                onClick={() => navigate(`/admin/lookbook/edit/${lookbook._id}`)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDelete(lookbook._id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
