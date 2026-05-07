-- Create password reset OTPs table
CREATE TABLE public.password_reset_otps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.password_reset_otps ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for requesting reset)
CREATE POLICY "Anyone can request password reset" 
ON public.password_reset_otps 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to select (for verification - will be done via edge function)
CREATE POLICY "Anyone can verify OTP" 
ON public.password_reset_otps 
FOR SELECT 
USING (true);

-- Allow anyone to update (for marking as used)
CREATE POLICY "Anyone can update OTP status" 
ON public.password_reset_otps 
FOR UPDATE 
USING (true);

-- Create index for faster lookups
CREATE INDEX idx_password_reset_otps_email ON public.password_reset_otps(email);
CREATE INDEX idx_password_reset_otps_expires_at ON public.password_reset_otps(expires_at);