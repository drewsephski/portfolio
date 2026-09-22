import type { ContactPayload } from "../contacts";
import { lookupContact } from "../contacts";
import { asRecord, normalizePhone, strField } from "../db";
import { DREWS_CLONE_ASSISTANT_ID } from "./constants";

export const GENERIC_FIRST_MESSAGE =
  "Hey, you've reached Drew's AI assistant. He couldn't grab the phone — I can help or take a message. What's up?";

export type AssistantRequestVapiResponse = {
  assistantId: string;
  assistantOverrides: {
    firstMessageMode: "assistant-speaks-first";
    firstMessage: string;
    variableValues: {
      vipName: string;
      vipGreeting: string;
      vipRelationship: string;
      isVip: "true" | "false";
    };
  };
};

function firstPhoneString(...values: unknown[]): string | null {
  for (const value of values) {
    const s = strField(value);
    if (s) {
      return s;
    }
  }
  return null;
}

function phoneFromCustomer(record: Record<string, unknown> | undefined): string | null {
  if (!record) {
    return null;
  }
  return firstPhoneString(
    record.number,
    record.phoneNumber,
    record.phone,
    record.sipUri
  );
}

/**
 * Extract inbound caller phone from Vapi assistant-request payloads (shape varies).
 */
export function extractInboundCallerPhone(
  body: Record<string, unknown>
): string | null {
  const message = asRecord(body.message);
  const call =
    asRecord(message?.call) ??
    asRecord(body.call);

  const customer =
    asRecord(call?.customer) ??
    asRecord(message?.customer) ??
    asRecord(body.customer);

  const from =
    asRecord(call?.from) ??
    asRecord(message?.from) ??
    asRecord(body.from);

  const raw =
    phoneFromCustomer(customer) ??
    firstPhoneString(from?.phoneNumber, from?.number, from?.phone) ??
    firstPhoneString(
      call?.phoneNumber,
      call?.phone,
      message?.phoneNumber,
      body.phoneNumber,
      body.callerNumber
    );

  if (!raw) {
    return null;
  }
  return normalizePhone(raw);
}

export function buildVipFirstMessage(contact: ContactPayload): string {
  const greeting = contact.greeting.trim() || `Hey ${contact.displayName}`.trim();
  const relationship = contact.relationship.trim().toLowerCase();

  if (relationship === "self") {
    return `${greeting} — it's your AI. He couldn't grab this. What's up?`;
  }

  return `${greeting} — it's Drew's AI. What's up?`;
}

export function buildAssistantRequestResponse(
  contact: ContactPayload | undefined
): AssistantRequestVapiResponse {
  if (!contact) {
    return {
      assistantId: DREWS_CLONE_ASSISTANT_ID,
      assistantOverrides: {
        firstMessageMode: "assistant-speaks-first",
        firstMessage: GENERIC_FIRST_MESSAGE,
        variableValues: {
          vipName: "",
          vipGreeting: "",
          vipRelationship: "",
          isVip: "false",
        },
      },
    };
  }

  return {
    assistantId: DREWS_CLONE_ASSISTANT_ID,
    assistantOverrides: {
      firstMessageMode: "assistant-speaks-first",
      firstMessage: buildVipFirstMessage(contact),
      variableValues: {
        vipName: contact.displayName,
        vipGreeting: contact.greeting,
        vipRelationship: contact.relationship,
        isVip: "true",
      },
    },
  };
}

export async function resolveAssistantRequest(
  body: Record<string, unknown>
): Promise<AssistantRequestVapiResponse> {
  const phone = extractInboundCallerPhone(body);

  if (!phone) {
    return buildAssistantRequestResponse(undefined);
  }

  try {
    const contact = await lookupContact(phone);
    return buildAssistantRequestResponse(contact);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "lookup_failed";
    console.error("drews_clone_assistant_request_lookup_failed", message);
    return buildAssistantRequestResponse(undefined);
  }
}
