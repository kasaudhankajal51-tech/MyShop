import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Sparkles, KeyRound, Briefcase, Phone } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
// import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').optional().or(z.literal('')),
});

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const resetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const newPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type AuthMode = 'signIn' | 'signUp' | 'forgotPassword' | 'verifyOtp' | 'newPassword';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>('signIn');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    accountType: 'retail', // 'retail' | 'wholesale'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const redirectParam = searchParams.get('redirect');
    const safeRedirect = redirectParam && redirectParam.startsWith('/') ? redirectParam : '/';

    if (user) {
      navigate(safeRedirect, { replace: true });
    }
  }, [user, navigate, searchParams]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const validateForm = () => {
    try {
      if (mode === 'signUp') {
        signUpSchema.parse(formData);
      } else if (mode === 'forgotPassword') {
        resetSchema.parse({ email: formData.email });
      } else if (mode === 'newPassword') {
        newPasswordSchema.parse({ password: formData.password, confirmPassword: formData.confirmPassword });
      } else if (mode === 'signIn') {
        signInSchema.parse({ email: formData.email, password: formData.password });
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const sendOTP = async (email: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      toast({
        title: 'OTP Sent!',
        description: 'Check your email for the verification code (or console for simulated SMS).',
      });
      
      setMode('verifyOtp');
      setResendTimer(60);
    } catch (error: any) {
      toast({
        title: 'Failed to send OTP',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (otpValue.length !== 6) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter the complete 6-digit OTP.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/users/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: otpValue }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid or expired OTP');
      }

      toast({
        title: 'OTP Verified!',
        description: 'Please set your new password.',
      });

      setMode('newPassword');
      setFormData({ ...formData, password: '', confirmPassword: '' });
    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp: otpValue,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      toast({
        title: 'Password Reset Successful!',
        description: 'You can now sign in with your new password.',
      });

      setMode('signIn');
      setOtpValue('');
      setFormData({ fullName: '', email: formData.email, password: '', confirmPassword: '', phone: '', accountType: 'retail' });
    } catch (error: any) {
      toast({
        title: 'Password reset failed',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'forgotPassword') {
      if (!validateForm()) return;
      await sendOTP(formData.email);
      return;
    }

    if (mode === 'verifyOtp') {
      await verifyOTP();
      return;
    }

    if (mode === 'newPassword') {
      await resetPassword();
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (mode === 'signUp') {
        const { error } = await signUp(formData.email, formData.password, formData.fullName, formData.phone, formData.accountType);
        
        if (error) {
          let message = error.message;
          if (message.includes('already registered')) {
            message = 'This email is already registered. Please sign in.';
          }
          toast({
            title: 'Sign up failed',
            description: message,
            variant: 'destructive',
          });
          return;
        }

        toast({
          title: 'Account created!',
          description: formData.accountType === 'wholesale' 
            ? 'Please complete your business profile.' 
            : 'You have successfully signed up.',
        });

        if (formData.accountType === 'wholesale') {
            navigate('/wholesale/register');
        } else {
             const redirectParam = searchParams.get('redirect');
             const safeRedirect = redirectParam && redirectParam.startsWith('/') ? redirectParam : '/';
             navigate(safeRedirect);
        }
      } else {
        const { error } = await signIn(formData.email, formData.password);

        if (error) {
          let message = error.message;
          if (message.includes('Invalid login')) {
            message = 'Invalid email or password. Please try again.';
          }
          toast({
            title: 'Sign in failed',
            description: message,
            variant: 'destructive',
          });
          return;
        }

        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in.',
        });

        // Check if user is wholesaler
        // We need to get the user data from the sign in response or wait for the user state to update
        // Since signIn returns error or nothing, we might need to fetch profile or check the response if we modified it
        // BUT, the useAuth().user object will be updated. 
        // However, user state update might be async.
        // Let's rely on the useEffect hook at the top of the component to handle redirection 
        // or check the localStorage which we updated in AuthContext.
        
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        
        if (userInfo.accountType === 'wholesale') {
            navigate('/wholesale/dashboard');
        } else {
             const redirectParam = searchParams.get('redirect');
             const safeRedirect = redirectParam && redirectParam.startsWith('/') ? redirectParam : '/';
             navigate(safeRedirect);
        }
      }
    } finally {
      setLoading(false);
    }
  };



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'signUp': return 'Create your account';
      case 'forgotPassword': return 'Reset your password';
      case 'verifyOtp': return 'Enter OTP';
      case 'newPassword': return 'Set new password';
      default: return 'Welcome back';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'signUp': return 'Join us to explore amazing fashion';
      case 'forgotPassword': return "Enter your email and we'll send you an OTP";
      case 'verifyOtp': return `We've sent a 6-digit code to ${formData.email}`;
      case 'newPassword': return 'Create a strong password for your account';
      default: return 'Sign in to continue shopping';
    }
  };

  const getButtonText = () => {
    if (loading) return 'Please wait...';
    switch (mode) {
      case 'signUp': return 'Create account';
      case 'forgotPassword': return 'Send OTP';
      case 'verifyOtp': return 'Verify OTP';
      case 'newPassword': return 'Reset Password';
      default: return 'Sign in';
    }
  };

  return (
    <div className="min-h-screen bg-background flex font-sans">
      {/* Left side - Editorial Content (Hidden on small screens) */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-[#1a1a1a]">
        <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
            alt="Editorial Fashion" 
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="relative z-10 flex flex-col justify-end p-20 text-white max-w-2xl">
            <h2 className="text-[10px] font-bold tracking-[0.5em] uppercase text-primary mb-6 italic">The Collective</h2>
            <h3 className="text-5xl font-display font-medium tracking-tight leading-none mb-8 italic">TIMLESS <span className="not-italic font-bold text-primary">TRADITIONS</span></h3>
            <p className="text-sm font-bold tracking-[0.2em] uppercase text-white/60 leading-relaxed max-w-md">
                Experience the intersection of heritage craftsmanship and modern silhouettes. Your journey into luxury ethnic wear begins here.
            </p>
            <div className="mt-12 flex gap-12 border-t border-white/10 pt-10">
                <div className="space-y-1">
                    <p className="text-2xl font-display font-bold">10k+</p>
                    <p className="text-[9px] font-black tracking-widest uppercase text-white/40">Patrons</p>
                </div>
                <div className="space-y-1">
                    <p className="text-2xl font-display font-bold">50+</p>
                    <p className="text-[9px] font-black tracking-widest uppercase text-white/40">Ateliers</p>
                </div>
            </div>
        </div>
      </div>

      {/* Right side - Refined Form */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 lg:px-24 bg-background">
        <div className="w-full max-w-md mx-auto space-y-12">
          {/* Logo & Back Link */}
          <div className="flex flex-col gap-8">
            <Link to="/" className="inline-flex items-center gap-3 text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground/60 hover:text-primary transition-all group">
                <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                Back to Boutique
            </Link>
            <div className="space-y-1">
                <h1 className="text-2xl font-display font-medium uppercase tracking-[0.2em]">
                    BALAJI <span className="text-primary italic">TEXTILES</span>
                </h1>
                <div className="h-px w-12 bg-primary/40" />
            </div>
          </div>

          {/* Form Header */}
          <div className="space-y-3">
            <h2 className="text-3xl font-display font-medium tracking-tight italic">
                {getTitle().split(' ').slice(0, -1).join(' ')} <span className="not-italic font-bold text-primary">{getTitle().split(' ').slice(-1)}</span>
            </h2>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground/80">
                {getDescription()}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Sign Up - Full Name */}
            {mode === 'signUp' && (
              <div className="space-y-3">
                <Label htmlFor="fullName" className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Full Identity</Label>
                <div className="relative group">
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-6 text-[11px] font-bold tracking-widest focus-visible:ring-0 focus-visible:border-primary transition-all uppercase placeholder:text-muted-foreground/20"
                    placeholder="ENTER YOUR FULL NAME"
                  />
                  <div className="absolute bottom-0 left-0 h-px w-0 bg-primary group-focus-within:w-full transition-all duration-700" />
                </div>
                {errors.fullName && (
                  <p className="text-[9px] font-bold text-destructive uppercase tracking-widest mt-1">{errors.fullName}</p>
                )}
              </div>
            )}

            {/* Phone Number - Show for Sign Up */}
            {mode === 'signUp' && (
                <div className="space-y-3">
                    <Label htmlFor="phone" className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Phone Contact</Label>
                    <div className="relative group">
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            className="bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-6 text-[11px] font-bold tracking-widest focus-visible:ring-0 focus-visible:border-primary transition-all uppercase placeholder:text-muted-foreground/20"
                            placeholder="CONTACT NUMBER"
                        />
                        <div className="absolute bottom-0 left-0 h-px w-0 bg-primary group-focus-within:w-full transition-all duration-700" />
                    </div>
                    {errors.phone && (
                        <p className="text-[9px] font-bold text-destructive uppercase tracking-widest mt-1">{errors.phone}</p>
                    )}
                </div>
            )}

            {/* Email - shown for signIn, signUp, forgotPassword */}
            {(mode === 'signIn' || mode === 'signUp' || mode === 'forgotPassword') && (
              <div className="space-y-3">
                <Label htmlFor="email" className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Email Address</Label>
                <div className="relative group">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-6 text-[11px] font-bold tracking-widest focus-visible:ring-0 focus-visible:border-primary transition-all uppercase placeholder:text-muted-foreground/20"
                    placeholder="YOU@EXAMPLE.COM"
                  />
                  <div className="absolute bottom-0 left-0 h-px w-0 bg-primary group-focus-within:w-full transition-all duration-700" />
                </div>
                {errors.email && (
                  <p className="text-[9px] font-bold text-destructive uppercase tracking-widest mt-1">{errors.email}</p>
                )}
              </div>
            )}

            {/* OTP Input */}
            {mode === 'verifyOtp' && (
              <div className="flex flex-col items-center space-y-8 py-4">
                <Label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">ENTER SECURITY CODE</Label>
                <InputOTP
                  maxLength={6}
                  value={otpValue}
                  onChange={(value) => setOtpValue(value)}
                  className="gap-4"
                >
                  <InputOTPGroup className="gap-4">
                    {[0, 1, 2, 3, 4, 5].map((idx) => (
                        <InputOTPSlot 
                            key={idx} 
                            index={idx} 
                            className="w-12 h-16 border-0 border-b border-border/60 text-lg font-bold rounded-none focus:border-primary transition-all"
                        />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                
                <div className="text-center">
                  {resendTimer > 0 ? (
                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground/60 uppercase">
                      RESEND CODE IN <span className="text-primary">{resendTimer}S</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => sendOTP(formData.email)}
                      className="text-[10px] font-bold tracking-widest text-primary uppercase border-b border-primary/20 hover:border-primary transition-all"
                      disabled={loading}
                    >
                      RESEND CODE
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Password - shown for signIn, signUp */}
            {(mode === 'signIn' || mode === 'signUp') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Secure Password</Label>
                  {mode === 'signIn' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgotPassword');
                        setErrors({});
                      }}
                      className="text-[9px] font-bold tracking-widest text-primary uppercase border-b border-primary/20 hover:border-primary transition-all"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-6 text-[11px] font-bold tracking-widest focus-visible:ring-0 focus-visible:border-primary transition-all uppercase placeholder:text-muted-foreground/20"
                    placeholder="********"
                  />
                  <div className="absolute bottom-0 left-0 h-px w-0 bg-primary group-focus-within:w-full transition-all duration-700" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[9px] font-bold text-destructive uppercase tracking-widest mt-1">{errors.password}</p>
                )}
              </div>
            )}

            {/* New Password Fields */}
            {mode === 'newPassword' && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">New Credential</Label>
                  <div className="relative group">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      className="bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-6 text-[11px] font-bold tracking-widest focus-visible:ring-0 focus-visible:border-primary transition-all uppercase placeholder:text-muted-foreground/20"
                      placeholder="NEW PASSWORD"
                    />
                    <div className="absolute bottom-0 left-0 h-px w-0 bg-primary group-focus-within:w-full transition-all duration-700" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="confirmPassword" className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Confirm Credential</Label>
                  <div className="relative group">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-6 text-[11px] font-bold tracking-widest focus-visible:ring-0 focus-visible:border-primary transition-all uppercase placeholder:text-muted-foreground/20"
                      placeholder="CONFIRM PASSWORD"
                    />
                    <div className="absolute bottom-0 left-0 h-px w-0 bg-primary group-focus-within:w-full transition-all duration-700" />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6 pt-4">
                <Button 
                    type="submit" 
                    className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-none text-[11px] font-bold tracking-[0.4em] uppercase shadow-2xl transition-all" 
                    disabled={loading}
                >
                {getButtonText()}
                </Button>
                
                {/* Google Login - Refined */}
                {(mode === 'signIn' || mode === 'signUp') && (
                    <div className="space-y-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border/40" />
                            </div>
                            <div className="relative flex justify-center text-[9px] font-bold uppercase tracking-[0.3em]">
                                <span className="bg-background px-4 text-muted-foreground/40">
                                    Alternative Entry
                                </span>
                            </div>
                        </div>
                        <a
                            href="/api/users/google/retail"
                            className="w-full h-16 inline-flex items-center justify-center gap-4 border border-border/60 rounded-none text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-secondary/5 transition-all"
                        >
                            <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            CONTINUE WITH GOOGLE
                        </a>
                    </div>
                )}
            </div>
          </form>

          {/* Mode Toggle */}
          <div className="pt-8 text-center">
            {(mode === 'forgotPassword' || mode === 'verifyOtp' || mode === 'newPassword') ? (
              <button
                type="button"
                className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground/60 hover:text-primary transition-all border-b border-transparent hover:border-primary/20 pb-1"
                onClick={() => {
                  setMode('signIn');
                  setErrors({});
                  setOtpValue('');
                }}
              >
                Return to <span className="text-primary">Sign In</span>
              </button>
            ) : (
              <button
                type="button"
                className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground/60 hover:text-primary transition-all border-b border-transparent hover:border-primary/20 pb-1"
                onClick={() => {
                  setMode(mode === 'signUp' ? 'signIn' : 'signUp');
                  setErrors({});
                }}
              >
                {mode === 'signUp' ? 'Member? ' : 'First Discovery? '}
                <span className="text-primary italic">{mode === 'signUp' ? 'SIGN IN' : 'CREATE ACCOUNT'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
