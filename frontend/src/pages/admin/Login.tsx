import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, ArrowLeft, KeyRound, Smartphone } from 'lucide-react';
import { z } from 'zod';
import api from '@/lib/api';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type AuthMode = 'login' | 'forgot' | 'verify' | 'reset';

export default function AdminLogin() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [adminType, setAdminType] = useState<'retail' | 'wholesale' | null>(null); // New state for admin type
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const { signIn, user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if mode is already selected in localStorage? 
    // Maybe better to force selection on login page visit if not logged in.
    const savedMode = localStorage.getItem('adminMode');
    if (savedMode && (savedMode === 'retail' || savedMode === 'wholesale')) {
        setAdminType(savedMode as 'retail' | 'wholesale');
    }

    if (user && isAdmin) {
      const redirect = searchParams.get('redirect') || '/admin';
      navigate(redirect, { replace: true });
    }
  }, [user, isAdmin, navigate, searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleModeSelect = (type: 'retail' | 'wholesale') => {
      setAdminType(type);
      localStorage.setItem('adminMode', type);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      loginSchema.parse({ email: formData.email, password: formData.password });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, ...Object.fromEntries(error.errors.map(err => [err.path[0], err.message])) }));
        return;
      }
    }

    // Access Control Check
    if (formData.email !== 'kasaudhankajal48@gmail.com') {
         toast({
          title: 'Access Denied',
          description: 'This area is restricted to authorized administrators only.',
          variant: 'destructive',
        });
        return;
    }

    setLoading(true);
    try {
      const { error } = await signIn(formData.email, formData.password);
      if (error) {
        toast({
          title: 'Access Denied',
          description: 'Invalid credentials or unauthorized access.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        await api.post('/users/forgot-password', { email: formData.email });
        toast({
            title: "OTP Sent",
            description: "Please check your email/phone for the verification code.",
        });
        setMode('verify');
    } catch (error: any) {
        toast({
            title: "Error",
            description: error.response?.data?.message || "Failed to send OTP",
            variant: "destructive"
        });
    } finally {
        setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
          await api.post('/users/verify-otp', { email: formData.email, otp: formData.otp });
          toast({
              title: "Verified",
              description: "OTP verified successfully. Please set a new password.",
          });
          setMode('reset');
      } catch (error: any) {
          toast({
              title: "Verification Failed",
              description: "Invalid OTP",
              variant: "destructive"
          });
      } finally {
          setLoading(false);
      }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.newPassword !== formData.confirmPassword) {
          toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
          return;
      }

      setLoading(true);
      try {
          await api.post('/users/reset-password', { 
              email: formData.email, 
              otp: formData.otp, 
              password: formData.newPassword 
          });
          toast({
              title: "Success",
              description: "Password reset successfully. Please login.",
          });
          setMode('login');
          setFormData(prev => ({ ...prev, password: '' })); // Clear password field
      } catch (error: any) {
          toast({
              title: "Error",
              description: "Failed to reset password",
              variant: "destructive"
          });
      } finally {
          setLoading(false);
      }
  };

  const getTitle = () => {
    if (!adminType) return 'Admin Access';
    switch (mode) {
      case 'login': return `${adminType === 'retail' ? 'Retail' : 'Wholesale'} Admin Login`;
      case 'forgot': return 'Reset Password';
      case 'verify': return 'Verify OTP';
      case 'reset': return 'Set New Password';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-slate-900 p-8 text-center relative">
          {/* Back Button Logic */}
          {(!adminType || mode !== 'login') && (
            <button 
              onClick={() => {
                  if (mode !== 'login') {
                      setMode('login');
                      setErrors({});
                  } else {
                      setAdminType(null); // Go back to type selection
                      localStorage.removeItem('adminMode');
                  }
              }}
              className="absolute left-4 top-4 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          
          <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
            {mode === 'login' ? (
              <ShieldCheck className="h-8 w-8 text-white" />
            ) : (
              <KeyRound className="h-8 w-8 text-white" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{getTitle()}</h1>
          <p className="text-slate-400 text-sm">Secure access for store administrators</p>
        </div>

        <div className="p-8">
            {/* Mode Selection */}
            {!adminType ? (
                <div className="space-y-4">
                    <p className="text-center text-sm text-muted-foreground mb-4">Select the admin panel you wish to access:</p>
                    <button
                        onClick={() => handleModeSelect('retail')}
                        className="w-full p-4 border-2 border-slate-200 rounded-lg hover:border-slate-900 hover:bg-slate-50 transition-all group text-left"
                    >
                        <h3 className="font-semibold text-lg text-slate-900 group-hover:text-primary">Retail Admin</h3>
                        <p className="text-xs text-slate-500">Manage standard products, B2C orders, and retail customers.</p>
                    </button>
                    <button
                        onClick={() => handleModeSelect('wholesale')}
                        className="w-full p-4 border-2 border-slate-200 rounded-lg hover:border-slate-900 hover:bg-slate-50 transition-all group text-left"
                    >
                        <h3 className="font-semibold text-lg text-slate-900 group-hover:text-primary">Wholesale Admin</h3>
                        <p className="text-xs text-slate-500">Manage bulk inventory, B2B orders, and wholesale accounts.</p>
                    </button>
                </div>
            ) : (
                <>
                  {/* Login Form */}
                  {mode === 'login' && (
                    <form onSubmit={handleLogin} className="space-y-5">
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <div className="mt-1.5 relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="pl-10"
                            placeholder="admin@example.com"
                          />
                        </div>
                        {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <Label htmlFor="password">Password</Label>
                          <button
                            type="button"
                            onClick={() => {
                              setMode('forgot');
                              setErrors({});
                            }}
                            className="text-sm text-slate-600 hover:text-slate-900"
                          >
                            Forgot password?
                          </button>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            className="pl-10 pr-10"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        {errors.password && <p className="mt-1 text-sm text-destructive">{errors.password}</p>}
                      </div>

                      <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800" disabled={loading}>
                        {loading ? 'Authenticating...' : `Access ${adminType === 'retail' ? 'Retail' : 'Wholesale'} Dashboard`}
                      </Button>
                    </form>
                  )}

                  {/* Forgot Password - Determine Email */}
                  {mode === 'forgot' && (
                    <form onSubmit={handleForgotSubmit} className="space-y-5">
                       <div>
                        <Label htmlFor="email">Email Address</Label>
                        <div className="mt-1.5 relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="pl-10"
                            placeholder="admin@example.com"
                            required
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Enter your registered email to receive an OTP.
                        </p>
                      </div>
                      <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800" disabled={loading}>
                        {loading ? 'Sending...' : 'Send OTP'}
                      </Button>
                    </form>
                  )}

                  {/* Verify OTP */}
                  {mode === 'verify' && (
                      <form onSubmit={handleVerifyOtp} className="space-y-5">
                          <div>
                              <Label htmlFor="otp">Verification Code</Label>
                              <div className="mt-1.5 relative">
                                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                  <Input
                                      id="otp"
                                      name="otp"
                                      type="text"
                                      value={formData.otp}
                                      onChange={handleChange}
                                      className="pl-10"
                                      placeholder="Enter 6-digit OTP"
                                      required
                                  />
                              </div>
                          </div>
                          <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800" disabled={loading}>
                              {loading ? 'Verifying...' : 'Verify OTP'}
                          </Button>
                      </form>
                  )}

                  {/* Reset Password */}
                  {mode === 'reset' && (
                      <form onSubmit={handleResetPassword} className="space-y-5">
                          <div>
                              <Label htmlFor="newPassword">New Password</Label>
                              <div className="mt-1.5 relative">
                                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                  <Input
                                      id="newPassword"
                                      name="newPassword"
                                      type="password"
                                      value={formData.newPassword}
                                      onChange={handleChange}
                                      className="pl-10"
                                      placeholder="New Password"
                                      required
                                  />
                              </div>
                          </div>
                          <div>
                              <Label htmlFor="confirmPassword">Confirm Password</Label>
                              <div className="mt-1.5 relative">
                                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                  <Input
                                      id="confirmPassword"
                                      name="confirmPassword"
                                      type="password"
                                      value={formData.confirmPassword}
                                      onChange={handleChange}
                                      className="pl-10"
                                      placeholder="Confirm New Password"
                                      required
                                  />
                              </div>
                          </div>
                          <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800" disabled={loading}>
                              {loading ? 'Resetting...' : 'Reset Password'}
                          </Button>
                      </form>
                  )}
                </>
            )}

          <div className="mt-6 text-center">
            {mode === 'login' && !adminType && (
              <a href="/" className="text-sm text-slate-500 hover:text-slate-700">
                Back to Store
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
