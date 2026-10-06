import { canonicalUrl } from "@/lib/site";
import Link from "next/link";
import { AlertCircle, KeyRound, Lock } from "lucide-react";
import { unlockInbox } from "../actions";
import { isInboxKeyValid } from "../_lib/auth";
import { InboxHeader } from "../_components/inbox-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata = { alternates: { canonical: canonicalUrl("/inbox/unlock") } };

export default async function InboxUnlockPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string; error?: string }>;
}) {
  const params = await searchParams;
  const invalidAttempt = params.error === "1";

  if (params.key && isInboxKeyValid(params.key)) {
    return (
      <div className="flex min-h-[50dvh] flex-col items-center justify-center py-10">
        <Card className="w-full max-w-md border-border/60 bg-card/60">
          <CardHeader className="text-center">
            <CardTitle>Unlocking inbox…</CardTitle>
            <CardDescription>Setting your secure session cookie.</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button
              render={
                <Link
                  href={`/inbox/auth?key=${encodeURIComponent(params.key)}`}
                  aria-label="Continue to inbox"
                />
              }
            >
              Continue
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-4 sm:py-8">
      <InboxHeader title="Menace Inbox" subtitle="Owner access" />

      <Card className="mx-auto w-full max-w-md border-border/60 bg-card/50 shadow-sm">
        <CardHeader className="space-y-3 text-center sm:text-left">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted sm:mx-0">
            <Lock className="size-5 text-muted-foreground" aria-hidden />
          </div>
          <CardTitle className="text-xl">Unlock your inbox</CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            Paste the same secret you use for Drew&apos;s Clone leads API. This sets a secure
            cookie for 14 days on this device.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {invalidAttempt ? (
            <Alert variant="destructive" role="alert">
              <AlertCircle className="size-4" />
              <AlertTitle>Invalid key</AlertTitle>
              <AlertDescription>
                That key did not match. Use the value from{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">DREWS_CLONE_LEADS_AUTH</code>{" "}
                or <code className="rounded bg-muted px-1 py-0.5 text-xs">MENACE_INBOX_SECRET</code>.
              </AlertDescription>
            </Alert>
          ) : null}

          <form className="space-y-4" action={unlockInbox}>
            <div className="space-y-2">
              <Label htmlFor="inbox-key">Inbox key</Label>
              <div className="relative">
                <KeyRound
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="inbox-key"
                  name="key"
                  type="password"
                  autoComplete="off"
                  placeholder="Paste your secret key"
                  aria-label="Inbox access key"
                  required
                  className="min-h-11 pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Env vars: <span className="font-mono">DREWS_CLONE_LEADS_AUTH</span> or{" "}
                <span className="font-mono">MENACE_INBOX_SECRET</span>
              </p>
            </div>
            <Button type="submit" className="min-h-11 w-full">
              Unlock inbox
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
