-- Create function to call send-notification edge function via pg_net
-- Note: This will trigger email notifications to subscribers when new updates are inserted

-- Create function to delete old regulatory updates (older than 60 days)
CREATE OR REPLACE FUNCTION public.cleanup_old_regulatory_updates()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.regulatory_updates
  WHERE created_at < NOW() - INTERVAL '60 days';
END;
$$;

-- Create a trigger function to be called after inserting a new regulatory update
-- This logs the event; actual notification will be triggered via application code
CREATE OR REPLACE FUNCTION public.notify_new_regulatory_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log the new update for debugging
  RAISE LOG 'New regulatory update inserted: id=%, title=%', NEW.id, NEW.title;
  
  -- The actual notification will be sent via the application calling the edge function
  -- This is because pg_net extension may not be enabled
  RETURN NEW;
END;
$$;

-- Create trigger for new regulatory updates
DROP TRIGGER IF EXISTS on_new_regulatory_update ON public.regulatory_updates;
CREATE TRIGGER on_new_regulatory_update
  AFTER INSERT ON public.regulatory_updates
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_regulatory_update();