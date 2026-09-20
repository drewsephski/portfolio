"use server";

import { revalidatePath } from "next/cache";
import { patchInboxCall } from "@/app/api/menace/inbox/_lib/queries";
import type { InboxDisposition } from "@/app/api/menace/inbox/_lib/types";
import { verifyInboxServerAction } from "./_lib/auth";

export type InboxActionState = {
  ok: boolean;
  message?: string;
};

async function guard(): Promise<boolean> {
  return verifyInboxServerAction();
}

async function runAction(work: () => Promise<void>): Promise<void> {
  if (!(await guard())) {
    return;
  }
  await work();
}

export async function setCallDisposition(
  callId: string,
  disposition: InboxDisposition
): Promise<void> {
  await runAction(async () => {
    const updated = await patchInboxCall(callId, {
      disposition,
      readAt: disposition === "done" ? new Date().toISOString() : undefined,
    });
    if (!updated) {
      return;
    }
    revalidatePath("/inbox");
    revalidatePath(`/inbox/${callId}`);
  });
}

export async function saveOwnerNote(
  callId: string,
  formData: FormData
): Promise<void> {
  await runAction(async () => {
    const ownerNote = String(formData.get("ownerNote") ?? "");
    const updated = await patchInboxCall(callId, { ownerNote });
    if (!updated) {
      return;
    }
    revalidatePath(`/inbox/${callId}`);
  });
}

export async function markCallRead(callId: string): Promise<void> {
  await runAction(async () => {
    const updated = await patchInboxCall(callId, {
      readAt: new Date().toISOString(),
    });
    if (!updated) {
      return;
    }
    revalidatePath("/inbox");
    revalidatePath(`/inbox/${callId}`);
  });
}
