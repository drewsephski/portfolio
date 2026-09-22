import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { callerInitials } from "../_lib/format";

interface CallerAvatarProps {
  name: string;
  className?: string;
}

export function CallerAvatar({ name, className }: CallerAvatarProps) {
  return (
    <Avatar className={className} size="default">
      <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
        {callerInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
