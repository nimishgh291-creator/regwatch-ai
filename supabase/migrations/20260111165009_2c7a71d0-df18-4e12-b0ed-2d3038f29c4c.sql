-- Add detailed_analysis and dev_impact_score columns to regulatory_updates
ALTER TABLE public.regulatory_updates 
ADD COLUMN IF NOT EXISTS detailed_analysis text[],
ADD COLUMN IF NOT EXISTS dev_impact_score integer CHECK (dev_impact_score >= 1 AND dev_impact_score <= 10),
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();

-- Enable Row Level Security
ALTER TABLE public.regulatory_updates ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (regulatory updates are public info)
CREATE POLICY "Anyone can read regulatory updates" 
ON public.regulatory_updates 
FOR SELECT 
USING (true);