import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  wishlist?: string[];
  token: string;
}

interface Profile {
  full_name?: string;
  phone?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, phone?: string, accountType?: string) => Promise<{ error: any }>;
  signOut: () => void;
  updateProfile: (data: any) => Promise<{ error: any }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for token in URL (Google Login Redirect)
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
        const fetchGoogleUser = async () => {
             try {
                 const { data } = await api.get('/users/profile', {
                     headers: {
                         Authorization: `Bearer ${token}`
                     }
                 });
                 
                 const userData = { ...data, token }; // Ensure token is included
                 setUser(userData);
                 localStorage.setItem('userInfo', JSON.stringify(userData));
                 
                 toast({
                    title: 'Login Successful',
                    description: `Welcome back, ${userData.name}!`,
                 });

                 window.location.href = '/';
                 
             } catch (error) {
                 console.error("Google Login User Fetch Error", error);
                 toast({
                     title: 'Login Failed',
                     description: 'Could not retrieve user data after Google Login.',
                     variant: 'destructive'
                 });
             }
        };
        
        fetchGoogleUser();
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    } else {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data } = await api.post('/users/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { error: null };
    } catch (error: any) {
      return {
        error: error.response && error.response.data.message
          ? { message: error.response.data.message }
          : { message: error.message },
      };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    try {
      const { data } = await api.post('/users', { name: fullName, email, password, phone });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { error: null };
    } catch (error: any) {
      return {
        error: error.response && error.response.data.message
          ? { message: error.response.data.message }
          : { message: error.message },
      };
    }
  };

  const signOut = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    toast({
      title: 'Signed out',
      description: 'You have been successfully signed out.',
    });
    window.location.href = '/'; 
  };

  const updateProfile = async (data: any) => {
    try {
      // Assuming 'full_name' is passed from frontend, map to 'name'
      const payload = {
        name: data.full_name,
        phone: data.phone,
        email: data.email,
        password: data.password // if changed
      };
      
      const { data: updatedUser } = await api.put('/users/profile', payload);
      setUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      return { error: null };
    } catch (error: any) {
      console.error(error);
      return {
        error: error.response && error.response.data.message
          ? { message: error.response.data.message }
          : { message: error.message },
      };
    }
  };
  


  const refreshUser = async () => {
    try {
        const { data } = await api.get('/users/profile');
        // Preserve the existing token from localStorage
        const existingUser = user || JSON.parse(localStorage.getItem('userInfo') || '{}');
        const updatedUser = {
            ...data,
            token: existingUser.token, // Keep the existing token
        };
        setUser(updatedUser);
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    } catch (error) {
        console.error("Failed to refresh user", error);
    }
  };
  
  // Derived profile from user
  const profile: Profile | null = user ? {
      full_name: user.name,
      email: user.email,
      phone: user.phone || '', 
  } : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin: user?.role === 'admin',
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
