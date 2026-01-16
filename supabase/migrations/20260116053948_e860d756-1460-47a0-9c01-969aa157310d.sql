-- Enable pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily cleanup at 2 AM UTC
SELECT cron.schedule(
  'cleanup-old-regulatory-updates',
  '0 2 * * *',
  $$SELECT public.cleanup_old_regulatory_updates()$$
);