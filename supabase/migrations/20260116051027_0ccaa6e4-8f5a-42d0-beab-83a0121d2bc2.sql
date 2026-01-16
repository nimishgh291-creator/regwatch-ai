-- Add email validation function
CREATE OR REPLACE FUNCTION public.validate_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate email format
  IF NEW.email !~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Normalize email to lowercase
  NEW.email := LOWER(TRIM(NEW.email));
  
  RETURN NEW;
END;
$$;

-- Create trigger for email validation on insert
CREATE TRIGGER validate_subscriber_email
  BEFORE INSERT ON public.subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_email();

-- Add unique constraint on email to prevent duplicates
ALTER TABLE public.subscribers 
  ADD CONSTRAINT subscribers_email_unique UNIQUE (email);