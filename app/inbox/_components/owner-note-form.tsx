"use client";

import { saveOwnerNote } from "../actions";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PendingSubmitButton } from "./pending-submit-button";

interface OwnerNoteFormProps {
  callId: string;
  initialNote: string;
}

export function OwnerNoteForm({ callId, initialNote }: OwnerNoteFormProps) {
  return (
    <form className="space-y-3" action={saveOwnerNote.bind(null, callId)}>
      <div className="space-y-2">
        <Label htmlFor="owner-note">Private follow-up note</Label>
        <Textarea
          id="owner-note"
          name="ownerNote"
          defaultValue={initialNote}
          placeholder="Add context for your next follow-up…"
          rows={4}
          className="min-h-[7rem] resize-y"
        />
      </div>
      <PendingSubmitButton className="min-h-11 w-full sm:w-auto" pendingLabel="Saving…">
        Save note
      </PendingSubmitButton>
    </form>
  );
}
