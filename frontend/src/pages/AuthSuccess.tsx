import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
        // Store token temporarily to allow authenticated request
        localStorage.setItem('userInfo', JSON.stringify({ token }));
        
        // Fetch full user profile and update context
        refreshUser()
            .then(() => {
                toast({
                    title: "Successfully logged in with Google",
                    description: "Welcome back!",
                });
                navigate('/');
            })
            .catch((err) => {
                console.error("Google login error:", err);
                toast({
                    title: "Login Failed",
                    description: "Could not retrieve user details.",
                    variant: "destructive"
                });
                navigate('/auth');
            });
    } else {
        navigate('/auth');
    }
  }, [searchParams, navigate, toast, refreshUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}
