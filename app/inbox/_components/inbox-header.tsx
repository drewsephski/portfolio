interface InboxHeaderProps {
  title: string;
  subtitle?: string;
}

export function InboxHeader({ title, subtitle = "Voice triage for Menace" }: InboxHeaderProps) {
  return (
    <header className="space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[1.65rem]">
        {title}
      </h1>
      {subtitle ? (
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      ) : null}
    </header>
  );
}
