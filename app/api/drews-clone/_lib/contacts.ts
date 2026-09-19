import { getSql } from "./db";

export type ContactRow = {
  phone: string;
  display_name: string;
  relationship: string;
  greeting: string;
  context: string;
  prefer_transfer: boolean;
  email: string;
};

export type ContactPayload = {
  phone: string;
  displayName: string;
  relationship: string;
  greeting: string;
  context: string;
  preferTransfer: boolean;
  email: string;
};

export function rowToContact(row: ContactRow): ContactPayload {
  return {
    phone: row.phone,
    displayName: row.display_name ?? "",
    relationship: row.relationship ?? "",
    greeting: row.greeting ?? "",
    context: row.context ?? "",
    preferTransfer: Boolean(row.prefer_transfer),
    email: row.email ?? "",
  };
}

export async function lookupContact(phone: string): Promise<ContactPayload | undefined> {
  const sql = getSql();
  if (!sql) {
    throw new Error("DREWS_CLONE_DATABASE_URL is not configured");
  }
  const rows = await sql`
    SELECT phone, display_name, relationship, greeting, context, prefer_transfer, email
    FROM drews_clone_contacts
    WHERE phone = ${phone}
  `;
  const row = rows[0] as ContactRow | undefined;
  if (!row) {
    return undefined;
  }
  return rowToContact(row);
}

export type LeadLookupSlice = {
  found: boolean;
  lead?: {
    phone: string;
    name: string;
    email: string;
    lastPurpose: string;
    lastCallAt: string | null;
    notes: string;
    callCount: number;
    createdAt: string;
    updatedAt: string;
  };
};

export type PhoneLookupResult = {
  found: boolean;
  lead?: LeadLookupSlice["lead"];
  contact?: ContactPayload;
};

export async function lookupPhoneWithContact(
  phone: string,
  leadLookup: (phone: string) => Promise<LeadLookupSlice>
): Promise<PhoneLookupResult> {
  const [leadResult, contact] = await Promise.all([
    leadLookup(phone),
    lookupContact(phone),
  ]);

  if (!leadResult.found && !contact) {
    return { found: false };
  }

  const result: PhoneLookupResult = { found: true };
  if (leadResult.lead) {
    result.lead = leadResult.lead;
  }
  if (contact) {
    result.contact = contact;
  }
  return result;
}
