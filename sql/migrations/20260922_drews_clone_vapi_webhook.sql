-- Drews Clone Vapi webhook ingestion (idempotent) — Neon project ancient-cloud-74430441
-- `call_id` is the Vapi call UUID (vapi_call_id).

ALTER TABLE drews_clone_calls
  ADD COLUMN IF NOT EXISTS organization text;

ALTER TABLE drews_clone_calls
  ADD COLUMN IF NOT EXISTS caller_type text;

ALTER TABLE drews_clone_calls
  ADD COLUMN IF NOT EXISTS reason text;

ALTER TABLE drews_clone_calls
  ADD COLUMN IF NOT EXISTS call_message text;

ALTER TABLE drews_clone_calls
  ADD COLUMN IF NOT EXISTS urgency text;

ALTER TABLE drews_clone_calls
  ADD COLUMN IF NOT EXISTS callback_requested boolean;

ALTER TABLE drews_clone_calls
  ADD COLUMN IF NOT EXISTS requested_next_step text;

ALTER TABLE drews_clone_calls
  ADD COLUMN IF NOT EXISTS calendar_event_created boolean;

ALTER TABLE drews_clone_calls
  ADD COLUMN IF NOT EXISTS calendar_event_time timestamptz;

ALTER TABLE drews_clone_calls
  ADD COLUMN IF NOT EXISTS structured_output_json jsonb;

ALTER TABLE drews_clone_calls
  ADD COLUMN IF NOT EXISTS vapi_event_json jsonb;

ALTER TABLE drews_clone_calls
  ADD COLUMN IF NOT EXISTS received_at timestamptz;

ALTER TABLE drews_clone_calls
  ADD COLUMN IF NOT EXISTS updated_at timestamptz;

ALTER TABLE drews_clone_calls
  ADD COLUMN IF NOT EXISTS cursor_forward_status text;

ALTER TABLE drews_clone_calls
  ADD COLUMN IF NOT EXISTS cursor_forward_attempts integer;

ALTER TABLE drews_clone_calls
  ADD COLUMN IF NOT EXISTS cursor_forward_last_error text;

ALTER TABLE drews_clone_calls
  ADD COLUMN IF NOT EXISTS cursor_forward_sent_at timestamptz;

UPDATE drews_clone_calls
SET received_at = COALESCE(received_at, created_at),
    updated_at = COALESCE(updated_at, created_at),
    cursor_forward_status = COALESCE(cursor_forward_status, 'pending'),
    cursor_forward_attempts = COALESCE(cursor_forward_attempts, 0)
WHERE received_at IS NULL
   OR updated_at IS NULL
   OR cursor_forward_status IS NULL
   OR cursor_forward_attempts IS NULL;

ALTER TABLE drews_clone_calls
  ALTER COLUMN cursor_forward_status SET DEFAULT 'pending';

ALTER TABLE drews_clone_calls
  ALTER COLUMN cursor_forward_attempts SET DEFAULT 0;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'drews_clone_calls_cursor_forward_status_check'
  ) THEN
    ALTER TABLE drews_clone_calls
      ADD CONSTRAINT drews_clone_calls_cursor_forward_status_check
      CHECK (cursor_forward_status IN ('pending', 'sent', 'failed', 'skipped'));
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS drews_clone_webhook_events (
  id bigserial PRIMARY KEY,
  vapi_call_id text,
  message_type text NOT NULL,
  dedupe_key text NOT NULL UNIQUE,
  payload jsonb NOT NULL,
  received_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS drews_clone_webhook_events_call_id_idx
  ON drews_clone_webhook_events (vapi_call_id);
