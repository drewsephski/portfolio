-- Menace Inbox v0 — idempotent columns on drews_clone_calls
-- Neon project: ancient-cloud-74430441

ALTER TABLE drews_clone_calls
  ADD COLUMN IF NOT EXISTS disposition text;

ALTER TABLE drews_clone_calls
  ADD COLUMN IF NOT EXISTS read_at timestamptz;

ALTER TABLE drews_clone_calls
  ADD COLUMN IF NOT EXISTS owner_note text;

UPDATE drews_clone_calls
SET disposition = CASE WHEN booked THEN 'booked' ELSE 'needs_you' END
WHERE disposition IS NULL;

ALTER TABLE drews_clone_calls
  ALTER COLUMN disposition SET DEFAULT 'needs_you';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'drews_clone_calls_disposition_check'
  ) THEN
    ALTER TABLE drews_clone_calls
      ADD CONSTRAINT drews_clone_calls_disposition_check
      CHECK (disposition IN ('needs_you', 'booked', 'done', 'spam', 'vip_followup'));
  END IF;
END $$;
