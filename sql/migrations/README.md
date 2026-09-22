# Menace Inbox migrations

Apply on Neon project `ancient-cloud-74430441` (Drews Clone database):

```bash
psql "$DREWS_CLONE_DATABASE_URL" -f sql/migrations/20260920_menace_inbox_disposition.sql
psql "$DREWS_CLONE_DATABASE_URL" -f sql/migrations/20260922_drews_clone_vapi_webhook.sql
```

Or paste the SQL into the Neon SQL editor. The migration is idempotent.
