-- Create subscribers table for email opt-in notifications
CREATE TABLE public.subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to subscribe (insert)
CREATE POLICY "Anyone can subscribe" 
ON public.subscribers 
FOR INSERT 
WITH CHECK (true);

-- Only allow reading own subscription (or service role)
CREATE POLICY "Users cannot read subscriber data" 
ON public.subscribers 
FOR SELECT 
USING (false);

-- Create index for faster email lookups
CREATE INDEX idx_subscribers_email ON public.subscribers(email);